import Texture2D from "./Texture2D";
import {Vector2, Vector3, Vector4, Color3, Color4} from "grimoirejs-math";
import {Matrix} from "grimoirejs-math";
import Program from "./Program";
export default class UniformProxy {
  private _gl: WebGLRenderingContext;

  private _currentTextureRegister: number = 0;
  constructor(public program: Program) {
    this._gl = program.gl;
  }

  public uniformBool(variableName: string, val: boolean): void {
    this._pass(variableName, (l) => this._gl.uniform1i(l, val ? 1 : 0));
  }

  public uniformMatrix(variableName: string, mat: Matrix): void {
    this._pass(variableName, (l) =>
      this._gl.uniformMatrix4fv(l, false, mat.rawElements as number[])
    );
  }

  public uniformFloat(variableName: string, val: number): void {
    this._pass(variableName, (l) =>
      this._gl.uniform1f(l, val)
    );
  }

  public uniformFloatArray(variableName: string, val: number[]): void {
    this._pass(variableName, (l) =>
      this._gl.uniform1fv(l, val)
    );
  }

  public uniformInt(variableName: string, val: number): void {
    this._pass(variableName, (l) =>
      this._gl.uniform1i(l, val)
    );
  }

  public uniformVector2(variableName: string, val: Vector2): void {
    this._pass(variableName, (l) =>
      this._gl.uniform2f(l, val.X, val.Y)
    );
  }

  public uniformVector2Array(variableName: string, val: number[]): void {
    this._pass(variableName, (l) => this._gl.uniform2fv(l, val));
  }

  public uniformVector3(variableName: string, val: Vector3): void {
    this._pass(variableName, (l) =>
      this._gl.uniform3f(l, val.X, val.Y, val.Z)
    );
  }

  public uniformVector3Array(variableName: string, val: number[]): void {
    this._pass(variableName, (l) => this._gl.uniform3fv(l, val));
  }

  public uniformColor3(variableName: string, val: Color3): void {
    this._pass(variableName, (l) =>
      this._gl.uniform3f(l, val.R, val.G, val.B)
    );
  }

  public uniformVector4(variableName: string, val: Vector4): void {
    this._pass(variableName, (l) =>
      this._gl.uniform4f(l, val.X, val.Y, val.Z, val.W)
    );
  }

  public uniformVector4Array(variableName: string, val: number[]): void {
    this._pass(variableName, (l) => this._gl.uniform4fv(l, val));
  }

  public uniformColor4(variableName: string, val: Color4): void {
    this._pass(variableName, (l) =>
      this._gl.uniform4f(l, val.R, val.G, val.B, val.A)
    );
  }

  public uniformTexture2D(variableName: string, val: Texture2D): void {
    if (val.valid) {
      val.register(this._currentTextureRegister);
      this.uniformInt(variableName, this._currentTextureRegister);
      this._currentTextureRegister++;
    } else {
      console.warn(`The texture assigned to '${variableName}' is not valid.`);
    }
  }

  public onUse(): void {
    this._currentTextureRegister = 0;
  }

  private _pass(variableName: string, act: (location: WebGLUniformLocation) => void) {
    const location = this.program.findUniformLocation(variableName);
    if (location) {
      act(location);
    }
  }

}
