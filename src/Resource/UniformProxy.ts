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
/** 
 * Provides abstractions of passing uniform values.
 * This proxy will cache uniform location automatically.
*/
export default class UniformProxy {
  private _gl: WebGLRenderingContext;

  /**
   * Index of texture index that havent used on this time.
   */
  private _currentTextureRegister = 0;
  constructor(public program: Program) {
    this._gl = program.gl;
  }
  /**
   * Passing bool value to specified uniform variable.
   * @param variableName variable name of uniform
   * @param val value to be passed.
   */
  public uniformBool(variableName: string, val: boolean): void {
    this._pass(variableName, l => this._gl.uniform1i(l, val ? 1 : 0));
  }

  /**
   * Passing matrix value to specified uniform variable
   * @param variableName variable name of uniform
   * @param mat value to be passed.
   */
  public uniformMatrix(variableName: string, mat: Matrix): void {
    this._pass(variableName, l => {
      this._gl.uniformMatrix4fv(l, false, mat.rawElements);
    });
  }

  /**
   * Passing Matrix as 3x3 matrix to specified uniform variable.
   * @param variableName variable name of uniform
   * @param mat value to be passed by reforming as 3x3 matrix.
   */
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

  /**
   * Passing Matrix Array from Float32Array to uniform variable.
   * You may need to flatten Matrix to Float32Array.
   * @param variableName variable name of uniform
   * @param mat value to be passed.
   */
  public uniformMatrixArray(variableName: string, matricies: Float32Array): void {
    const length = matricies.length / 16;
    for (let i = 0; i < length; i++) {
      this._passAsArray(variableName, i, (l) =>
        this._gl.uniformMatrix4fv(l, false, new Float32Array(matricies.buffer, matricies.byteOffset + i * 64)),
      );
    }
  }
  /**
 * Passing a single float value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformFloat(variableName: string, val: number): void {
    this._pass(variableName, (l) =>
      this._gl.uniform1f(l, val),
    );
  }
  /**
   * Passing float array from Float32Array to uniform variable.
   * You may need to flatten Matrix to Float32Array.
   * @param variableName variable name of uniform
   * @param mat value to be passed.
   */
  public uniformFloatArray(variableName: string, val: number[] | Float32Array): void {
    this._pass(variableName, (l) =>
      this._gl.uniform1fv(l, val),
    );
  }
  /**
 * Passing a single int value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformInt(variableName: string, val: number): void {
    this._pass(variableName, (l) =>
      this._gl.uniform1i(l, val),
    );
  }
  /**
 * Passing a single vec2 value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformVector2(variableName: string, val: Vector2): void {
    this._pass(variableName, (l) =>
      this._gl.uniform2f(l, val.X, val.Y),
    );
  }
  /**
 * Passing a single ivec2 value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformIntVector2(variableName: string, val: Vector2): void {
    this._pass(variableName, (l) =>
      this._gl.uniform2i(l, val.X, val.Y),
    );
  }
  /**
 * Passing a vec2[] value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformVector2Array(variableName: string, val: number[] | Float32Array): void {
    this._pass(variableName, (l) => this._gl.uniform2fv(l, val));
  }
  /**
 * Passing a single vec3 value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformVector3(variableName: string, val: Vector3): void {
    this._pass(variableName, (l) =>
      this._gl.uniform3f(l, val.X, val.Y, val.Z),
    );
  }
  /**
 * Passing a single ivec3 value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformIntVector3(variableName: string, val: Vector3): void {
    this._pass(variableName, (l) =>
      this._gl.uniform3i(l, val.X, val.Y, val.Z),
    );
  }
  /**
 * Passing a vec3[] value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformVector3Array(variableName: string, val: number[] | Float32Array): void {
    this._pass(variableName, (l) => this._gl.uniform3fv(l, val));
  }
  /**
 * Passing a vec3 value to uniform variable from Color3 instance.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformColor3(variableName: string, val: Color3): void {
    this._pass(variableName, (l) =>
      this._gl.uniform3f(l, val.R, val.G, val.B),
    );
  }
  /**
 * Passing a single vec4 value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformVector4(variableName: string, val: Vector4): void {
    this._pass(variableName, (l) =>
      this._gl.uniform4f(l, val.X, val.Y, val.Z, val.W),
    );
  }
  /**
 * Passing a single ivec4 value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformIntVector4(variableName: string, val: Vector4): void {
    this._pass(variableName, (l) =>
      this._gl.uniform4f(l, val.X, val.Y, val.Z, val.W),
    );
  }
  /**
 * Passing a vec4 value to uniform variable.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformVector4Array(variableName: string, val: number[] | Float32Array): void {
    this._pass(variableName, (l) => this._gl.uniform4fv(l, val));
  }
  /**
 * Passing a single vec4 value to uniform variable from Color4 instance.
 * @param variableName variable name of uniform
 * @param mat value to be passed.
 */
  public uniformColor4(variableName: string, val: Color4): void {
    this._pass(variableName, (l) =>
      this._gl.uniform4f(l, val.R, val.G, val.B, val.A),
    );
  }

  public uniformTexture2D(variableName: string, val: Texture2D): void {
    if (val.valid) {
      this._pass(variableName, (l) => {
        val.register(this._currentTextureRegister);
        this._gl.uniform1i(l, this._currentTextureRegister);
        this._currentTextureRegister++;
      });
    } else {
      console.warn(`The texture assigned to '${variableName}' is not valid.`);
    }
  }

  public uniformTextureCube(variableName: string, val: TextureCube): void {
    if (val && val.valid) {
      this._pass(variableName, (l) => {
        val.register(this._currentTextureRegister);
        this._gl.uniform1i(l, this._currentTextureRegister);
        this._currentTextureRegister++;
      });
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
