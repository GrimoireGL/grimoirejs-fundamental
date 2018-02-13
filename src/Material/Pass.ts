import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Geometry from "../Geometry/Geometry";
import ManagedProgram from "../Resource/ManagedProgram";
import GLStateConfigurator from "./GLStateConfigurator";
import IMaterialArgument from "./IMaterialArgument";
import Material from "./Material";
import MaterialFactory from "./MaterialFactory";
import PassProgram from "./PassProgram";
import IPassRecipe from "./Schema/IPassRecipe";
import Technique from "./Technique";
import UniformResolverContainer from "./UniformResolverContainer";
import UniformResolverRegistry from "./UniformResolverRegistry";
import GLExtRequestor from "../Resource/GLExtRequestor";
/**
 * Pass provides single draw call for a geometry.
 * Containing arguments of uniform variables and gl state configruations for each drawing call.
 * @return {Material} [description]
 */
export default class Pass {
  /**
   * Pass program instance. This is not actual WebGLProgram instance.
   * Pass will determine which WebGLProgram should be used by considering which geometry was used in actual drawing timing.
   * @return {Material} [description]
   */
  public program: PassProgram;

  /**
   * Get related material
   */
  public get material(): Material {
    return this.technique.material;
  }

  /**
   * Declaration of argument attributes.
   * @param  {Technique}   publictechnique  [description]
   * @param  {IPassRecipe} publicpassRecipe [description]
   * @return {[type]}                       [description]
   */
  public argumentDeclarations: { [key: string]: IAttributeDeclaration } = {};

  /**
   * Values of materila arguments.
   * These values would be passed to GPU for rendering.
   */
  public arguments: { [key: string]: any } = {};

  private _macroHandlers: { [key: string]: (value: any) => void } = {};

  private _uniformResolvers: UniformResolverContainer;

  private _dynamicStateResolver: (gl: WebGLRenderingContext, mat: IMaterialArgument) => void;

  private _gl: WebGLRenderingContext;

  private _argumentInitialized: boolean;

  constructor(public technique: Technique, public passRecipe: IPassRecipe) {
    this._uniformResolvers = UniformResolverRegistry.generateRegisterers(this, passRecipe);
    this._gl = this.material.gl;
    const factory = MaterialFactory.get(this._gl);
    const macroRegister = factory.macro;
    this._dynamicStateResolver = GLStateConfigurator.getDynamicStateResolver(this);
    this.program = new PassProgram(this._gl, passRecipe.vertex, passRecipe.fragment, passRecipe.extensions);
    // register macro
    for (const key in passRecipe.macros) {
      const macro = passRecipe.macros[key];
      this.program.setMacro(macro.macroName, macro.value + "");
      if (macro.target === "expose") {
        this._macroHandlers[key] = (value) => { // when changed the macro
          let assignValue;
          if (macro.type === "bool") {
            assignValue = value ? "" : undefined;
          } else {
            assignValue = value;
          }
          this.program.setMacro(macro.macroName, assignValue);
        };
        this.addArgument(key, {
          converter: macro.type === "bool" ? "Boolean" : "Number",
          default: macro.value,
        });
      } else if (macro.target === "refer") {
        this.program.setMacro(macro.macroName, macro.value + "");
        macroRegister.watch(macro.macroName, (val, immediate) => {
          this.program.setMacro(macro.macroName, val);
        }, true);
      }
    }
  }
  /**
   * Execute single drawcall with specified arguments.
   * @param {IMaterialArgument} args [description]
   */
  public draw(args: IMaterialArgument): void {
    // configure programs and gl states
    const p = this.program.getProgram(args.geometry);
    p.use();
    this._uniformResolvers.resolve(p.uniforms, args);
    GLStateConfigurator.get(this._gl).configureForPass(this.passRecipe); // configure for gl states
    this._dynamicStateResolver(this._gl, args);
    // draw actually
    for (const key in this.passRecipe.attributes) {
      const attribute = this.passRecipe.attributes[key];
      Geometry.bindBufferToAttribute(args.geometry, p, key, attribute.semantic);
    }
    Geometry.drawWithCurrentVertexBuffer(args.geometry, args.indexGroup, args.drawCount, args.drawOffset);
  }

  /**
   * Append an argument as pass variable.
   * This is mainly used for resolving uniform stages.
   */
  public addArgument(name: string, val: IAttributeDeclaration): void {
    if (this._argumentInitialized) {
      throw new Error("setArgument cant be called for initialized pass");
    }
    this.argumentDeclarations[name] = val;
  }
  /**
   * Update argument of specified value.
   */
  public setArgument(variableName: string, newValue: any, oldValue: any): void {
    if (this._macroHandlers[variableName]) { // if the value was macro
      this._macroHandlers[variableName](newValue);
    } else {
      this._uniformResolvers.update(this.program, variableName, newValue, oldValue);
    }
    this.arguments[variableName] = newValue;
  }
  /**
   * Destroy pass to release resources.
   */
  public dispose(): void {
    this._uniformResolvers.dispose();
    this.program.dispose();
  }
}
