import TransformComponent from "../Components/TransformComponent";
import Vector3 from "grimoirejs/lib/Core/Math/Vector3";
import Quaternion from "grimoirejs/lib/Core/Math/Quaternion";
import Matrix from "grimoirejs/lib/Core/Math/Matrix";
import ICamera from "./ICamera";
import {mat4, vec3} from "gl-matrix";
export default class PerspectiveCamera implements ICamera {
  private static _invertedUnitZ: Vector3 = new Vector3(0, 0, -1);
  private _viewMatrix: Matrix = new Matrix();
  private _invViewMatrix: Matrix = new Matrix();
  private _projectionMatrix: Matrix = new Matrix();
  private _invProjectionMatrix: Matrix = new Matrix();
  private _viewProjectionMatrix: Matrix = new Matrix();
  private _invViewProjectionMatrix: Matrix = new Matrix();
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
  public getViewProjectionMatrix(): Matrix {
    return this._viewProjectionMatrix;
  }
  public getInvViewProjectionMatrix(): Matrix {
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
    vec3.transformMat4(this._eyeCache.rawElements, Vector3.Zero.rawElements, transform.globalTransform.rawElements);
    vec3.transformMat4(this._lookAtCache.rawElements, PerspectiveCamera._invertedUnitZ.rawElements, transform.globalTransform.rawElements);
    vec3.add(this._lookAtCache.rawElements, this._lookAtCache.rawElements, this._eyeCache.rawElements);
    vec3.transformMat4(this._upCache.rawElements, Vector3.YUnit.rawElements, transform.globalTransform.rawElements);
    mat4.lookAt(this._viewMatrix.rawElements, this._eyeCache.rawElements, this._lookAtCache.rawElements, this._upCache.rawElements);
  }

  private _recalculateProjection(): void {
    mat4.perspective(this._projectionMatrix.rawElements, this._fovy, this._aspect, this._near, this._far);
  }

}
