import Shader from "../Resource/Shader";
import Geometry from "../Geometry/Geometry";
import IVariableInfo from "./IVariableInfo";
import UniformProxy from "../Resource/UniformProxy";
import UniformResolverRegistry from "./UniformResolverRegistry";
import Material from "./Material";
import IPassRecipe from "./IPassRecipe";
import IMaterialArgument from "./IMaterialArgument";
import Program from "../Resource/Program";
import header from "raw!./Static/header.glsl";

export default class Pass {

  private static _glEnableTargets: number[]
  = [WebGLRenderingContext.CULL_FACE,
    WebGLRenderingContext.DEPTH_TEST,
    WebGLRenderingContext.STENCIL_TEST,
    WebGLRenderingContext.BLEND,
    WebGLRenderingContext.SCISSOR_TEST,
    WebGLRenderingContext.DITHER,
    WebGLRenderingContext.POLYGON_OFFSET_FILL,
    WebGLRenderingContext.SAMPLE_ALPHA_TO_COVERAGE,
    WebGLRenderingContext.SAMPLE_COVERAGE];
  /**
   * [program description]
   * @type {Program}
   */
  public program: Program;

  public fs: Shader;

  public vs: Shader;

  private _registers: ((proxy: UniformProxy, args: IMaterialArgument) => void)[];

  private _macro: { [key: string]: any } = {};

  private _disposers: (() => void)[];

  private _gl: WebGLRenderingContext;

  private _disables: number[];

  private _fsCode: string;

  private _vsCode: string;

  constructor(public material: Material, public passRecipe: IPassRecipe) {
    const registers = UniformResolverRegistry.generateRegisterers(material, passRecipe);
    this._registers = registers.registerers;
    this._disposers = registers.disposers;
    this._gl = material.gl;
    this.program = new Program(this._gl);
    this.fs = new Shader(this._gl, WebGLRenderingContext.FRAGMENT_SHADER);
    this.vs = new Shader(this._gl, WebGLRenderingContext.VERTEX_SHADER);
    for (let key in passRecipe.macros) {
      const macro = passRecipe.macros[key];
      this._macro[key] = macro.value;
      this.material.addMacroObserver(key, {
        converter: macro.type === "bool" ? "Boolean" : "Number",
        default: macro.value
      }, (value) => {
        if (macro.type === "bool") {
          this._macro[macro.macroName] = value ? "" : undefined;
        } else {
          this._macro[macro.macroName] = value;
        }
        this._updateProgram();
      });
    }
    this._updateProgram();
    this._disables = Pass._glEnableTargets.concat();
    for (let i = 0; i < passRecipe.states.enable.length; i++) {
      const enable = passRecipe.states.enable[i];
      const index = this._disables.indexOf(enable);
      if (index > -1) {
        this._disables.splice(index, 1);
      }
    }

  }



  public draw(args: IMaterialArgument): void {
    this.program.use();
    for (let i = 0; i < this._registers.length; i++) { // register uniforms
      this._registers[i](this.program.uniforms, args);
    }
    this._configure();
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

  private _configure(): void {
    const states = this.passRecipe.states;
    const functions = this.passRecipe.states.functions;
    for (let i = 0; i < states.enable.length; i++) {
      this._gl.enable(states.enable[i]);
    }
    for (let i = 0; i < this._disables.length; i++) {
      this._gl.disable(this._disables[i]);
    }
    if (functions.blendColor) {
      this._gl.blendColor(functions.blendColor[0], functions.blendColor[1], functions.blendColor[2], functions.blendColor[3]);
    }
    if (functions.blendEquationSeparate) {
      this._gl.blendEquationSeparate(functions.blendEquationSeparate[0], functions.blendEquationSeparate[1]);
    }
    if (functions.blendFuncSeparate) {
      this._gl.blendFuncSeparate(functions.blendFuncSeparate[0], functions.blendFuncSeparate[1], functions.blendFuncSeparate[2], functions.blendFuncSeparate[3]);
    }
    if (functions.colorMask) {
      this._gl.colorMask(functions.colorMask[0], functions.colorMask[1], functions.colorMask[2], functions.colorMask[3]);
    }
    if (functions.cullFace) {
      this._gl.cullFace(functions.cullFace[0]);
    }
    if (functions.depthFunc) {
      this._gl.depthFunc(functions.depthFunc[0]);
    }
    if (functions.depthMask) {
      this._gl.depthMask(functions.depthMask[0]);
    }
    if (functions.depthRange) {
      this._gl.depthRange(functions.depthRange[0], functions.depthRange[1]);
    }
    if (functions.frontFace) {
      this._gl.frontFace(functions.frontFace[0]);
    }
    if (functions.lineWidth) {
      this._gl.lineWidth(functions.lineWidth[0]);
    }
    if (functions.polygonOffset) {
      this._gl.polygonOffset(functions.polygonOffset[0], functions.polygonOffset[1]);
    }
    if (functions.scissor) {
      this._gl.scissor(functions.scissor[0], functions.scissor[1], functions.scissor[2], functions.scissor[3]);
    }
  }

  private _updateProgram(): void {
    this.fs.update(this._generateShaderCode("FS"));
    this.vs.update(this._generateShaderCode("VS"));
    this.program.update([this.vs, this.fs]);
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
