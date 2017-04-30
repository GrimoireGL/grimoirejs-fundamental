import ManagedShader from "../Resource/ManagedShader";
import ManagedProgram from "../Resource/ManagedProgram";
import Geometry from "../Geometry/Geometry";
import ShaderMixer from "./ShaderMixer";
/**
 * Container of shader program used for Pass.
 * Pass needs to care which geometry will be drawn by a material.
 * (For determining what macro should be appended to shader by attribute variable exisiting)
 */
export default class PassProgram {

  public get macros(): {[key: string]: any} {
    return this._macros;
  }

  public set macros(val: {[key: string]: any}) {
    this._macros = val;
    this.dispose();
  }

  public get fragmentShader(): string {
    return this._fsSource;
  }

  public get vertexShader(): string {
    return this._vsSource;
  }

  public set fragmentShader(source: string){
    this._fsSource = source;
    this.dispose();
  }

  public set vertexShader(source: string){
    this._vsSource = source;
    this.dispose();
  }

  private _programs: {[hash: number]: ManagedProgram} = {};

  private _shaders: ManagedShader[] = [];

  constructor(private _gl: WebGLRenderingContext, private _vsSource: string, private _fsSource: string, private _macros: {[key: string]: any} = {}) {

  }

  public getProgram(geometry: Geometry): ManagedProgram {
    if (this._programs[geometry.accessorHash]) {
      return this._programs[geometry.accessorHash];
    }else {
      return this._constructProgram(geometry);
    }
  }

  public setMacro(macroName: string, value?: string|boolean): void {
    if (this._macros[macroName] !== value) {
      if (typeof value === "boolean") {
        this._macros[macroName] = value ? "" : undefined;
      }else {
        this._macros[macroName] = value;
      }
      this.dispose();
    }
  }

  public dispose(): void {
    for (let key in this._programs) {
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
