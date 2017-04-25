import ManagedProgram from "../Resource/ManagedProgram";
import ManagedShader from "../Resource/ManagedShader";
import MaterialFactory from "./MaterialFactory";
import Shader from "../Resource/Shader";
import Geometry from "../Geometry/Geometry";
import IVariableInfo from "./IVariableInfo";
import UniformProxy from "../Resource/UniformProxy";
import UniformResolverRegistry from "./UniformResolverRegistry";
import Material from "./Material";
import IPassRecipe from "./IPassRecipe";
import IMaterialArgument from "./IMaterialArgument";
import Program from "../Resource/Program";
import GLStateConfigurator from "./GLStateConfigurator";
import header from "raw-loader!./Static/header.glsl";

export default class Pass {
  /**
   * [program description]
   * @type {Program}
   */
  public program: ManagedProgram;

  public fs: ManagedShader;

  public vs: ManagedShader;

  private _registers: ((proxy: UniformProxy, args: IMaterialArgument) => void)[];

  private _macro: { [key: string]: any } = {};

  private _disposers: (() => void)[];

  private _gl: WebGLRenderingContext;

  private _fsCode: string;

  private _vsCode: string;

  constructor(public material: Material, public passRecipe: IPassRecipe) {
    const registers = UniformResolverRegistry.generateRegisterers(material, passRecipe);
    this._registers = registers.registerers;
    this._disposers = registers.disposers;
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
    for (let i = 0; i < this._registers.length; i++) { // register uniforms
      this._registers[i](this.program.uniforms, args);
    }
    GLStateConfigurator.configureForPass(this._gl, this.passRecipe); // configure for gl states
    for (let key in this.passRecipe.attributes) {
      const attribute = this.passRecipe.attributes[key];
      Geometry.bindBufferToAttribute(args.geometry, this.program, key, attribute.semantic);
    }
    Geometry.drawWithCurrentVertexBuffer(args.geometry, args.targetBuffer, args.drawCount, args.drawOffset);
  }

  public dispose(): void {
    for (let i = 0; i < this._disposers.length; i++) {
      this._disposers[i]();
    }
  }

  private _updateProgram(): void {
    let lFS = this.fs;
    this.fs = ManagedShader.getShader(this._gl, WebGLRenderingContext.FRAGMENT_SHADER, this._generateShaderCode("FS"));
    let lVS = this.vs;
    this.vs = ManagedShader.getShader(this._gl, WebGLRenderingContext.VERTEX_SHADER, this._generateShaderCode("VS"));
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

  private _generateShaderCode(shaderType: string): string {
    return `#define ${shaderType}\n${this._macroCode()}\n${header}/*BEGINNING OF USER CODE*/\n${shaderType === "VS" ? this.passRecipe.vertex : this.passRecipe.fragment}`;
  }

  private _macroCode(): string {
    let macroCode = "";
    for (let macroName in this._macro) {
      macroCode += `#define ${macroName} ${this._macro[macroName]}\n`;
    }
    return macroCode;
  }
}
