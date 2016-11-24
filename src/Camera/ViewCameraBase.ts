import TransformComponent from "../Components/TransformComponent";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Matrix from "grimoirejs-math/ref/Matrix";
import Vector4 from "grimoirejs-math/ref/Vector4";
import ICamera from "./ICamera";
import GLM from "grimoirejs-math/ref/GLM";
const {mat4, vec3, vec4} = GLM;
abstract class ViewCameraBase implements ICamera {
  private static _frontOrigin: Vector4 = new Vector4(0, 0, -1, 0);
  private static _upOrigin: Vector4 = new Vector4(0, 1, 0, 0);
  private _eyeCache: Vector3 = Vector3.Zero;
  private _lookAtCache: Vector3 = Vector3.Zero;
  private _upCache: Vector3 = Vector3.Zero;
  protected __viewMatrix: Matrix = new Matrix();
  protected __projectionMatrix: Matrix = new Matrix();
  protected __invProjectionMatrix: Matrix = new Matrix();
  protected __projectionViewMatrix: Matrix = new Matrix();

  public abstract getViewMatrix(): Matrix;
  public abstract getProjectionMatrix(): Matrix;
  public abstract getInvProjectionMatrix(): Matrix;
  public abstract getProjectionViewMatrix(): Matrix;
  public abstract getFar(): number;
  public abstract setFar(far: number): void;
  public abstract getNear(): number;
  public abstract setNear(near: number): void;
  public abstract getAspect(): number;
  public abstract setAspect(aspect: number): void;
  public abstract getFovy(): number;
  public abstract setFovy(fov: number): void;
  public abstract getOrthoSize(): number;
  public abstract setOrthoSize(size: number): void;
  public updateTransform(transform: TransformComponent): void {
    vec3.transformMat4(this._eyeCache.rawElements, Vector3.Zero.rawElements, transform.globalTransform.rawElements);
    vec4.transformMat4(this._lookAtCache.rawElements, ViewCameraBase._frontOrigin.rawElements, transform.globalTransform.rawElements);
    vec3.add(this._lookAtCache.rawElements, this._lookAtCache.rawElements, this._eyeCache.rawElements);
    vec4.transformMat4(this._upCache.rawElements, ViewCameraBase._upOrigin.rawElements, transform.globalTransform.rawElements);
    mat4.lookAt(this.__viewMatrix.rawElements, this._eyeCache.rawElements, this._lookAtCache.rawElements, this._upCache.rawElements);
    mat4.mul(this.__projectionViewMatrix.rawElements, this.__projectionMatrix.rawElements, this.__viewMatrix.rawElements);
  }

}

export default ViewCameraBase;
