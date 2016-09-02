import Texture2D from "./Texture2D";
import {Vector2, Vector3, Vector4, Color3, Color4} from "grimoirejs-math";
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
    const location = this.program.findUniformLocation(variableName);
    if (location) {
      this._gl.uniform1f(location, val);
    }
  }

  public uniformInt(variableName: string, val: number): void {
    const location = this.program.findUniformLocation(variableName);
    if (location) {
      this._gl.uniform1i(location, val);
    }
  }

  public uniformVector2(variableName: string, val: Vector2): void {
    const location = this.program.findUniformLocation(variableName);
    if (location) {
      this._gl.uniform2f(location, val.X, val.Y);
    }
  }

  public uniformVector3(variableName: string, val: Vector3): void {
    const location = this.program.findUniformLocation(variableName);
    if (location) {
      this._gl.uniform3f(location, val.X, val.Y, val.Z);
    }
  }

  public uniformColor3(variableName: string, val: Color3): void {
    const location = this.program.findUniformLocation(variableName);
    if (location) {
      this._gl.uniform3f(location, val.R, val.G, val.B);
    }
  }

  public uniformVector4(variableName: string, val: Vector4): void {
    const location = this.program.findUniformLocation(variableName);
    if (location) {
      this._gl.uniform4f(location, val.X, val.Y, val.Z, val.W);
    }
  }

  public uniformColor4(variableName: string, val: Color4): void {
    const location = this.program.findUniformLocation(variableName);
    if (location) {
      this._gl.uniform4f(location, val.R, val.G, val.B, val.A);
    }
  }

  public uniformTexture2D(variableName: string, val: Texture2D): void {
    if (val.valid) {
      val.register(0);
      this.uniformInt(variableName, 0);
    } // TODO pass alt texture
  }

}
