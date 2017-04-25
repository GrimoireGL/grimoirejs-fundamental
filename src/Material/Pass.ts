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
export default class Pass {

  public program: ManagedProgram;

  public fs: ManagedShader;

  public vs: ManagedShader;

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
          this._updateProgram();
        });
      } else if (macro.target === "refer") {
        this._macro[macro.macroName] = macro.value;
        macroRegister.watch(macro.macroName, (val, immediate) => {
          this._macro[macro.macroName] = val;
          if (!immediate) {
            this._updateProgram();
          }
        }, true);
      }
    }
    this._updateProgram();
  }



  public draw(args: IMaterialArgument): void {
    this.program.use();
    this._uniformResolvers.resolve(this.program.uniforms, args);
    GLStateConfigurator.configureForPass(this._gl, this.passRecipe); // configure for gl states
    for (let key in this.passRecipe.attributes) {
      const attribute = this.passRecipe.attributes[key];
      Geometry.bindBufferToAttribute(args.geometry, this.program, key, attribute.semantic);
    }
    Geometry.drawWithCurrentVertexBuffer(args.geometry, args.targetBuffer, args.drawCount, args.drawOffset);
  }

  public dispose(): void {
    this._uniformResolvers.dispose();
  }

  private _updateProgram(): void {
    let lFS = this.fs;
    this.fs = ManagedShader.getShader(this._gl, WebGLRenderingContext.FRAGMENT_SHADER, ShaderMixer.generate(WebGLRenderingContext.FRAGMENT_SHADER, this._macro, this.passRecipe.fragment));
    let lVS = this.vs;
    this.vs = ManagedShader.getShader(this._gl, WebGLRenderingContext.VERTEX_SHADER, ShaderMixer.generate(WebGLRenderingContext.VERTEX_SHADER, this._macro, this.passRecipe.vertex));
    if (lFS && lVS) {
      lFS.release();
      lVS.release();
    }
    let lP = this.program;
    this.program = ManagedProgram.getProgram(this._gl, [this.vs, this.fs]);
    if (lP) {
      lP.release();
    }
  }
}
