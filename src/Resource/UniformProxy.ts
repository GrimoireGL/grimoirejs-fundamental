import Color3 from "grimoirejs-math/ref/Color3";
import Color4 from "grimoirejs-math/ref/Color4";
import Matrix from "grimoirejs-math/ref/Matrix";
import Vector2 from "grimoirejs-math/ref/Vector2";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Vector4 from "grimoirejs-math/ref/Vector4";
import Program from "./Program";
import Texture2D from "./Texture2D";
import TextureCube from "./TextureCube";

const mat3Cache = new Float32Array(9);

export default class UniformProxy {
  private _gl: WebGLRenderingContext;

  private _currentTextureRegister = 0;
  constructor(public program: Program) {
    this._gl = program.gl;
  }

  public uniformBool(variableName: string, val: boolean): void {
    this._pass(variableName, l => this._gl.uniform1i(l, val ? 1 : 0));
  }

  public uniformMatrix(variableName: string, mat: Matrix): void {
    this._pass(variableName, l => {
      this._gl.uniformMatrix4fv(l, false, mat.rawElements as number[]);
    });
  }

  public uniformMatrix3(variableName: string, mat: Matrix): void {
    this._pass(variableName, l => {
      const r = mat.rawElements;
      for (let i = 0; i < 3; i++) {
        mat3Cache[3 * i + 0] = r[4 * i + 0];
        mat3Cache[3 * i + 1] = r[4 * i + 1];
        mat3Cache[3 * i + 2] = r[4 * i + 2];
      }
      this._gl.uniformMatrix3fv(l, false, mat3Cache);
    });
  }

  public uniformMatrixArray(variableName: string, matricies: Float32Array): void {
    const length = matricies.length / 16;
    for (let i = 0; i < length; i++) {
      this._passAsArray(variableName, i, (l) =>
        this._gl.uniformMatrix4fv(l, false, new Float32Array(matricies.buffer, matricies.byteOffset + i * 64)),
      );
    }
  }

  public uniformFloat(variableName: string, val: number): void {
    this._pass(variableName, (l) =>
      this._gl.uniform1f(l, val),
    );
  }

  public uniformFloatArray(variableName: string, val: number[]): void {
    this._pass(variableName, (l) =>
      this._gl.uniform1fv(l, val),
    );
  }

  public uniformInt(variableName: string, val: number): void {
    this._pass(variableName, (l) =>
      this._gl.uniform1i(l, val),
    );
  }

  public uniformVector2(variableName: string, val: Vector2): void {
    this._pass(variableName, (l) =>
      this._gl.uniform2f(l, val.X, val.Y),
    );
  }

  public uniformIntVector2(variableName: string, val: Vector2): void {
    this._pass(variableName, (l) =>
      this._gl.uniform2i(l, val.X, val.Y),
    );
  }

  public uniformVector2Array(variableName: string, val: number[] | Float32Array): void {
    this._pass(variableName, (l) => this._gl.uniform2fv(l, val));
  }

  public uniformVector3(variableName: string, val: Vector3): void {
    this._pass(variableName, (l) =>
      this._gl.uniform3f(l, val.X, val.Y, val.Z),
    );
  }

  public uniformIntVector3(variableName: string, val: Vector3): void {
    this._pass(variableName, (l) =>
      this._gl.uniform3i(l, val.X, val.Y, val.Z),
    );
  }

  public uniformVector3Array(variableName: string, val: number[] | Float32Array): void {
    this._pass(variableName, (l) => this._gl.uniform3fv(l, val));
  }

  public uniformColor3(variableName: string, val: Color3): void {
    this._pass(variableName, (l) =>
      this._gl.uniform3f(l, val.R, val.G, val.B),
    );
  }

  public uniformVector4(variableName: string, val: Vector4): void {
    this._pass(variableName, (l) =>
      this._gl.uniform4f(l, val.X, val.Y, val.Z, val.W),
    );
  }

  public uniformIntVector4(variableName: string, val: Vector4): void {
    this._pass(variableName, (l) =>
      this._gl.uniform4f(l, val.X, val.Y, val.Z, val.W),
    );
  }

  public uniformVector4Array(variableName: string, val: number[] | Float32Array): void {
    this._pass(variableName, (l) => this._gl.uniform4fv(l, val));
  }

  public uniformColor4(variableName: string, val: Color4): void {
    this._pass(variableName, (l) =>
      this._gl.uniform4f(l, val.R, val.G, val.B, val.A),
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

  public uniformTextureCube(variableName: string, val: TextureCube): void {
    if (val && val.valid) {
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

  private _passAsArray(variableName: string, index: number, act: (location: WebGLUniformLocation) => void) {
    // tslint:disable-next-line:prefer-template
    const location = this.program.findUniformLocation(variableName + "[" + index + "]");
    if (location) {
      act(location);
    }
  }

}
