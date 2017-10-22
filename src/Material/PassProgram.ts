import Geometry from "../Geometry/Geometry";
import ManagedProgram from "../Resource/ManagedProgram";
import ManagedShader from "../Resource/ManagedShader";
import ShaderMixer from "./ShaderMixer";
/**
 * Container of shader program used for Pass.
 * Pass needs to care which geometry will be drawn by a material.
 * (For determining what macro should be appended to shader by attribute variable exisiting)
 */
export default class PassProgram {

  /**
   * macros registered dynamically of this programs
   * @return {[type]} [description]
   */
  public get macros(): { [key: string]: any } {
    return this._macros;
  }

  public set macros(val: { [key: string]: any }) {
    this._macros = val;
    this.dispose();
  }
  /**
   * Original fragment shader code
   * @return {string} [description]
   */
  public get fragmentShader(): string {
    return this._fsSource;
  }
  /**
   * Original vertex shader code
   * @param  {string} source [description]
   * @return {[type]}        [description]
   */
  public set fragmentShader(source: string) {
    this._fsSource = source;
    this.dispose();
  }

  public get vertexShader(): string {
    return this._vsSource;
  }

  public set vertexShader(source: string) {
    this._vsSource = source;
    this.dispose();
  }

  private _programs: { [hash: number]: ManagedProgram } = {};

  private _shaders: ManagedShader[] = [];

  constructor(private _gl: WebGLRenderingContext, private _vsSource: string, private _fsSource: string, private _macros: { [key: string]: any } = {}) {

  }
  /**
   * Fetch a program instance with specified geometry
   * @param  {Geometry}       geometry [description]
   * @return {ManagedProgram}          [description]
   */
  public getProgram(geometry: Geometry): ManagedProgram {
    if (this._programs[geometry.accessorHash]) {
      return this._programs[geometry.accessorHash];
    } else {
      return this._constructProgram(geometry);
    }
  }

  /**
   * Update programs with specified macro value.
   * @param {string}         macroName [description]
   * @param {string|boolean} value     [description]
   */
  public setMacro(macroName: string, value?: string | boolean): void {
    if (this._macros[macroName] !== value) {
      if (typeof value === "boolean") {
        this._macros[macroName] = value ? "" : undefined;
      } else {
        this._macros[macroName] = value;
      }
      this.dispose();
    }
  }

  /**
   * Destroy instance to relase resources.
   */
  public dispose(): void {
    for (const key in this._programs) {
      this._programs[key].release();
    }
    this._programs = {};
    this._shaders.forEach(s => s.release());
    this._shaders = [];
  }

  private _constructProgram(geometry: Geometry): ManagedProgram {
    const fs = ManagedShader.getShader(this._gl, WebGLRenderingContext.FRAGMENT_SHADER, ShaderMixer.generate(WebGLRenderingContext.FRAGMENT_SHADER, this._macros, this._fsSource, geometry));
    const vs = ManagedShader.getShader(this._gl, WebGLRenderingContext.VERTEX_SHADER, ShaderMixer.generate(WebGLRenderingContext.VERTEX_SHADER, this._macros, this._vsSource, geometry));
    const program = ManagedProgram.getProgram(this._gl, [vs, fs]);
    this._shaders.push(fs);
    this._shaders.push(vs);
    this._programs[geometry.accessorHash] = program;
    return program;
  }
}
