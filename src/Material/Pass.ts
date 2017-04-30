import ManagedProgram from "../Resource/ManagedProgram";
import ManagedShader from "../Resource/ManagedShader";
import MaterialFactory from "./MaterialFactory";
import Geometry from "../Geometry/Geometry";
import UniformProxy from "../Resource/UniformProxy";
import UniformResolverRegistry from "./UniformResolverRegistry";
import Material from "./Material";
import IPassRecipe from "./IPassRecipe";
import IMaterialArgument from "./IMaterialArgument";
import GLStateConfigurator from "./GLStateConfigurator";
import ShaderMixer from "./ShaderMixer";
import UniformResolverContainer from "./UniformResolverContainer";
import PassProgram from "./PassProgram";
export default class Pass {

  public program: PassProgram;

  private _macro: { [key: string]: any } = {};

  private _uniformResolvers: UniformResolverContainer;

  private _gl: WebGLRenderingContext;

  constructor(public material: Material, public passRecipe: IPassRecipe) {
    this._uniformResolvers = UniformResolverRegistry.generateRegisterers(material, passRecipe);
    this._gl = material.gl;
    const factory = MaterialFactory.get(this._gl);
    const macroRegister = factory.macro;
    // register macro
    for (let key in passRecipe.macros) {
      const macro = passRecipe.macros[key];
      this._macro[macro.macroName] = macro.value;
      if (macro.target === "expose") {
        this.material.addMacroObserver(key, {
          converter: macro.type === "bool" ? "Boolean" : "Number",
          default: macro.value
        }, (value) => { // when changed the macro
          if (macro.type === "bool") {
            this._macro[macro.macroName] = value ? "" : undefined;
          } else {
            this._macro[macro.macroName] = value;
          }
          this.program.macros = this._macro;
        });
      } else if (macro.target === "refer") {
        this._macro[macro.macroName] = macro.value;
        macroRegister.watch(macro.macroName, (val, immediate) => {
          this._macro[macro.macroName] = val;
          if (!immediate) {
            this.program.macros = this._macro;
          }
        }, true);
      }
    }
    this.program = new PassProgram(this._gl, passRecipe.vertex, passRecipe.fragment, this._macro);
  }



  public draw(args: IMaterialArgument): void {
    const p = this.program.getProgram(args.geometry);
    p.use();
    this._uniformResolvers.resolve(p.uniforms, args);
    GLStateConfigurator.configureForPass(this._gl, this.passRecipe); // configure for gl states
    for (let key in this.passRecipe.attributes) {
      const attribute = this.passRecipe.attributes[key];
      Geometry.bindBufferToAttribute(args.geometry, p, key, attribute.semantic);
    }
    Geometry.drawWithCurrentVertexBuffer(args.geometry, args.targetBuffer, args.drawCount, args.drawOffset);
  }

  public update(variableName: string, newValue: any, oldValue: any): void {
    this._uniformResolvers.update(this.program, variableName, newValue, oldValue);
  }

  public dispose(): void {
    this._uniformResolvers.dispose();
    this.program.dispose();
  }
}
