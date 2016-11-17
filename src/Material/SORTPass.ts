import Shader from "../Resource/Shader";
import MaterialFactory from "./MaterialFactory";
import IMaterialArgument from "./IMaterialArgument";
import Program from "../Resource/Program";
import ISORTPassInfo from "./Transformers/Interfaces/ISORTPassInfo";
import Pass from "./Pass";
export default class SORTPass extends Pass {
  public gl: WebGLRenderingContext;

  public fs: Shader;

  public vs: Shader;

  private _macroValues: { [key: string]: string } = {};

  public setMacro(key: string, value: string | boolean): void {
    if (typeof value === "boolean") {
      this._macroValues[key] = value ? "" : null;
    } else {
      this._macroValues[key] = value;
    }
    this._updateProgram();
  }

  public getMacro(key: string): string {
    return this._macroValues[key];
  }

  constructor(public factory: MaterialFactory, public sort: ISORTPassInfo) {
    super();
    this.attributes = Object.keys(sort.attributes);
    this.gl = factory.gl;
    this.fs = new Shader(this.gl, WebGLRenderingContext.FRAGMENT_SHADER);
    this.vs = new Shader(this.gl, WebGLRenderingContext.VERTEX_SHADER);
    this.program = new Program(this.gl);
    factory.macro.addObserver(() => {
      this._updateProgram();
    });
    this._updateProgram();
  }

  protected __beforeDraw(args: IMaterialArgument): void {
    for (let attributeKey in this.sort.gomlAttributes) {
      this.sort.gomlAttributes[attributeKey].register(this.program.uniforms, args);
    }
    for (let registerer of this.sort.systemRegisterers) {
      registerer(this.program.uniforms, args);
    }
    // apply gl states
    for (let configurator of this.sort.configurator) {
      configurator(this.gl)
    }
  }

  private _updateProgram(): void {
    this.fs.update(this._generateShaderCode("FS"));
    this.vs.update(this._generateShaderCode("VS"));
    this.program.update([this.vs, this.fs]);
  }

  private _generateShaderCode(shaderType: string): string {
    return `#define ${shaderType}\n${this.factory.shaderHeader}\n${this.factory.macro.macroString}\n${this._getMaterialMacro()}\n/*BEGINNING OF USER CODE*/\n${this.sort.shaderSource}`;
  }

  /**
   * Obtain macro code of material
   * @return {string} [description]
   */
  private _getMaterialMacro(): string {
    let result = "";
    for (let key in this._macroValues) {
      if (this._macroValues[key] === null) {
        continue;
      }
      result += `#define ${key} ${this._macroValues[key]}\n`;
    }
    return result;
  }
}
