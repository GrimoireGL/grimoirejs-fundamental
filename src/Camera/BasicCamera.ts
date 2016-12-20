import TransformComponent from "../Components/TransformComponent";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Vector4 from "grimoirejs-math/ref/Vector4";
import Matrix from "grimoirejs-math/ref/Matrix";
import GLM from "grimoirejs-math/ref/GLM";
const {mat4, vec3, vec4} = GLM;
/**
 * Provides perspective camera as implementation of ICamera.
 */
export default class BasicCamera {
  private static _frontOrigin: Vector4 = new Vector4(0, 0, -1, 0);
  private static _upOrigin: Vector4 = new Vector4(0, 1, 0, 0);
  private _eyeCache: Vector3 = Vector3.Zero;
  private _lookAtCache: Vector3 = Vector3.Zero;
  private _upCache: Vector3 = Vector3.Zero;
  protected __viewMatrix: Matrix = new Matrix();
  protected __projectionMatrix: Matrix = new Matrix();
  protected __invProjectionMatrix: Matrix = new Matrix();
  protected __projectionViewMatrix: Matrix = new Matrix();
  private _far: number;
  private _near: number;
  private _fovy: number;
  private _orthoSize: number;
  private _aspect: number;
  private _orthographic: boolean = false;

  public getViewMatrix(): Matrix {
    return this.__viewMatrix;
  }
  public getProjectionMatrix(): Matrix {
    return this.__projectionMatrix;
  }
  public getInvProjectionMatrix(): Matrix {
    return this.__invProjectionMatrix;
  }
  public getProjectionViewMatrix(): Matrix {
    return this.__projectionViewMatrix;
  }
  public getFar(): number {
    return this._far;
  }
  public setFar(far: number): void {
    this._far = far;
    this._recalculateProjection();
  }
  public getNear(): number {
    return this._near;
  }
  public setNear(near: number): void {
    this._near = near;
    this._recalculateProjection();
  }
  public getAspect(): number {
    return this._aspect;
  }
  public setAspect(aspect: number): void {
    this._aspect = aspect;
    this._recalculateProjection();
  }
  public getFovy(): number {
    return this._fovy;
  }

  public setFovy(fov: number): void {
    this._fovy = fov;
    this._recalculateProjection();
  }

  public getOrthoSize(): number {
    return this._orthoSize;
  }

  public setOrthoSize(size: number) {
    this._orthoSize = size;
  }

  public setOrthographicMode(isOrtho: boolean): void {
    this._orthographic = isOrtho;
    this._recalculateProjection();
  }

  public getOrthographicMode(): boolean {
    return this._orthographic;
  }

  public updateTransform(transform: TransformComponent): void {
    vec3.transformMat4(this._eyeCache.rawElements, Vector3.Zero.rawElements, transform.globalTransform.rawElements);
    vec4.transformMat4(this._lookAtCache.rawElements, BasicCamera._frontOrigin.rawElements, transform.globalTransform.rawElements);
    vec3.add(this._lookAtCache.rawElements, this._lookAtCache.rawElements, this._eyeCache.rawElements);
    vec4.transformMat4(this._upCache.rawElements, BasicCamera._upOrigin.rawElements, transform.globalTransform.rawElements);
    mat4.lookAt(this.__viewMatrix.rawElements, this._eyeCache.rawElements, this._lookAtCache.rawElements, this._upCache.rawElements);
    mat4.mul(this.__projectionViewMatrix.rawElements, this.__projectionMatrix.rawElements, this.__viewMatrix.rawElements);
  }

  private _recalculateProjection(): void {
    if (!this._orthographic) {
      mat4.perspective(this.__projectionMatrix.rawElements, this._fovy, this._aspect, this._near, this._far);
    } else {
      mat4.ortho(this.__projectionMatrix.rawElements, -this._orthoSize * this._aspect, this._orthoSize * this._aspect, -this._orthoSize, this._orthoSize, this._near, this._far);
    }
    mat4.mul(this.__projectionViewMatrix.rawElements, this.__projectionMatrix.rawElements, this.__viewMatrix.rawElements);
    mat4.invert(this.__invProjectionMatrix.rawElements, this.__projectionMatrix.rawElements);
  }
}
