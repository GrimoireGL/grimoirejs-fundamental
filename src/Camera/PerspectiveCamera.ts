import TransformComponent from "../Components/TransformComponent";
import Vector3 from "grimoirejs/lib/Core/Math/Vector3";
import Vector4 from "grimoirejs/lib/Core/Math/Vector4";
import Quaternion from "grimoirejs/lib/Core/Math/Quaternion";
import Matrix from "grimoirejs/lib/Core/Math/Matrix";
import ICamera from "./ICamera";
import {mat4, vec3, vec4} from "gl-matrix";
/**
 * Provides perspective camera as implementation of ICamera.
 */
export default class PerspectiveCamera implements ICamera {
  private static _frontOrigin: Vector4 = new Vector4(0, 0, -1, 0);
  private static _upOrigin: Vector4 = new Vector4(0, 1, 0, 0);
  private _viewMatrix: Matrix = new Matrix();
  private _invViewMatrix: Matrix = new Matrix();
  private _projectionMatrix: Matrix = new Matrix();
  private _invProjectionMatrix: Matrix = new Matrix();
  private _projectionViewMatrix: Matrix = new Matrix();
  private _invProjectionViewMatrix: Matrix = new Matrix();
  private _far: number;
  private _near: number;
  private _fovy: number;
  private _aspect: number;
  private _eyeCache: Vector3 = Vector3.Zero;
  private _lookAtCache: Vector3 = Vector3.Zero;
  private _upCache: Vector3 = Vector3.Zero;

  public getViewMatrix(): Matrix {
    return this._viewMatrix;
  }
  public getInvViewMatrix(): Matrix {
    return null; // TODO
  }
  public getProjectionMatrix(): Matrix {
    return this._projectionMatrix;
  }
  public getInvProjectionMatrix(): Matrix {
    return null; // TODO
  }
  public getProjectionViewMatrix(): Matrix {
    return this._projectionViewMatrix;
  }
  public getInvProjectionViewMatrix(): Matrix {
    return null; // TODO
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

  public updateTransform(transform: TransformComponent): void {
    console.log(transform.globalTransform.toString());
    vec3.transformMat4(this._eyeCache.rawElements, Vector3.Zero.rawElements, transform.globalTransform.rawElements);
    vec4.transformMat4(this._lookAtCache.rawElements, PerspectiveCamera._frontOrigin.rawElements, transform.globalTransform.rawElements);
    vec3.add(this._lookAtCache.rawElements, this._lookAtCache.rawElements, this._eyeCache.rawElements);
    vec4.transformMat4(this._upCache.rawElements, PerspectiveCamera._upOrigin.rawElements, transform.globalTransform.rawElements);
    mat4.lookAt(this._viewMatrix.rawElements, this._eyeCache.rawElements, this._lookAtCache.rawElements, this._upCache.rawElements);
    mat4.mul(this._projectionViewMatrix.rawElements, this._projectionMatrix.rawElements, this._viewMatrix.rawElements);
  }

  private _recalculateProjection(): void {
    mat4.perspective(this._projectionMatrix.rawElements, this._fovy, this._aspect, this._near, this._far);
    mat4.mul(this._projectionViewMatrix.rawElements, this._projectionMatrix.rawElements, this._viewMatrix.rawElements);
  }

}
