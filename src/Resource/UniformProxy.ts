import {Matrix} from "grimoirejs-math";
import Program from "./Program";
export default class UniformProxy {
  private _gl: WebGLRenderingContext;
  constructor(public program: Program) {
    this._gl = program.gl;
  }

  public uniformMatrix(variableName: string, mat: Matrix): void {
    const location = this.program.findUniformLocation(variableName);
    if (location) {
      this._gl.uniformMatrix4fv(location, false, mat.rawElements as number[]);
    }
  }

  public uniformFloat(variableName: string, val: number): void {
    const location = this.program.findUniformLocation(variableName)
    if (location) {
      this._gl.uniform1f(location, val);
    }
  }
}
