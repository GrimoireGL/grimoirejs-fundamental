import GLM from "grimoirejs-math/ref/GLM";
import Matrix from "grimoirejs-math/ref/Matrix";
import Quaternion from "grimoirejs-math/ref/Quaternion";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Vector4 from "grimoirejs-math/ref/Vector4";
import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import CameraComponent from "./CameraComponent";
import HierarchycalComponentBase from "./HierarchicalComponentBase";
import { attribute, watch, componentInAncestor } from "grimoirejs/ref/Core/Decorator";
import { quat } from "gl-matrix";
const { mat4, vec3, vec4 } = GLM;
/**
 * Transform component manages transform matrices and provide basic parameters to control transform of the object.
 * You can control objects by position,rotation, and scale.
 */
export default class Transform extends HierarchycalComponentBase {
  public static componentName = "Transform";
  /**
   * Source vector to be multiplied with global transform to calculate forward direction of attached object.
   */
  private static _forwardBase: Vector4 = new Vector4(0, 0, -1, 0);

  /**
   * Source vector to be multiplied with global transform to calculate up direction of attached object.
   */
  private static _upBase: Vector4 = new Vector4(0, 1, 0, 0);

  /**
   * Source vector to be multiplied with global transform to calculate right direction of attached object.
   */
  private static _rightBase: Vector4 = new Vector4(1, 0, 0, 0);

  /**
   * Local transform matrix representing scaling,rotation and translation of attached object.
   * @return {[type]} [description]
   */
  public localTransform: Matrix = new Matrix();

  /**
   * Scale of attached object.
   * This scale will inherit parent transform.
   */
  @attribute("Vector3", [1, 1, 1])
  public scale!: Vector3;

  /**
 * Position of attached object.
 * This position is relative position from parent transform.
 */
  @attribute("Vector3", [0, 0, 0])
  public position!: Vector3;

  /**
   * Rotation of attached object.
   * This rotation is relative rotation from parent transform.
   */
  @attribute("Rotation3", [0, 0, 0, 1])
  public rotation!: Quaternion;

  /**
   * The children transform should be notified when this transform was updated.
   * @type {TransformComponent[]}
   */
  private _children: Transform[] = [];

  /**
   * The reference to parent TransformComponent.
   * When this object is root object of contained scene, this value should be null.
   * @type {TransformComponent}
   */
  @componentInAncestor(Transform, false)
  private _parentTransform!: Transform | null;

  private _cachePVM: Matrix = new Matrix();

  private _cacheVM: Matrix = new Matrix();

  /**
   * Cache of forward direction of this object
   */
  private _forward: Vector4 = new Vector4(0, 0, -1, 0);

  /**
   * Cache of up direction of this object.
   */
  private _up: Vector4 = new Vector4(0, 1, 0, 0);

  /**
   * Cache of right direction of this object.
   */
  private _right: Vector4 = new Vector4(1, 0, 0, 0);

  private _globalPosition: Vector3 = new Vector3(0, 0, 0);

  private _globalScale: Vector3 = new Vector3(1, 1, 1);

  private _globalRotation: Quaternion = Quaternion.Identity;

  private _matrixTransformMode = false;

  private _updatedTransform = true;

  private _globalTransform: Matrix = new Matrix();

  private _globalTransformInverse!: Matrix;

  /**
   * Global transform that consider parent transform and local transform
   * @return {[type]} [description]
   */
  public get globalTransform(): Matrix {
    this._updateTransform();
    return this._globalTransform;
  }

  public get globalTransformInverse(): Matrix {
    if (!this._globalTransformInverse) {
      this._globalTransformInverse = Matrix.inverse(this.globalTransform)!;
    } else {
      this._updateTransform();
    }
    return this._globalTransformInverse;
  }

  public get globalPosition(): Vector3 {
    this._updateTransform();
    return this._globalPosition;
  }

  public get globalScale(): Vector3 {
    this._updateTransform();
    return this._globalScale;
  }

  public get globalRotation(): Quaternion {
    this._updateTransform();
    return this._globalRotation;
  }

  public get forward(): Vector3 {
    this._updateTransform();
    return new Vector3(this._forward.X, this._forward.Y, this._forward.Z);
  }

  public get up(): Vector3 {
    this._updateTransform();
    return new Vector3(this._up.X, this._up.Y, this._up.Z);
  }

  public get right(): Vector3 {
    this._updateTransform();
    return new Vector3(this._forward.X, this._forward.Y, this._forward.Z);
  }

  public calcPVM(camera: CameraComponent): Matrix { // TODO: Possibility to have side effect
    mat4.mul(this._cachePVM.rawElements, camera.projectionViewMatrix.rawElements, this.globalTransform.rawElements);
    return this._cachePVM;
  }

  public calcVM(camera: CameraComponent): Matrix {
    mat4.mul(this._cacheVM.rawElements, camera.viewMatrix.rawElements, this.globalTransform.rawElements);
    return this._cacheVM;
  }

  protected $mount(): void {
    super.$mount();
    if (this._parentTransform) {
      this._parentTransform._children.push(this);
    }
    this._updateTransform();
  }

  protected $unmount(): void {
    super.$unmount();
    if (this._parentTransform) {
      this._parentTransform._children.splice(this._parentTransform._children.indexOf(this), 1);
      this._parentTransform = null;
    }
  }


  public notifyUpdateTransform(noDirectionalUpdate = false): void {
    if (!this._updatedTransform) {
      this._updatedTransform = true;
      this._children.forEach(c => c.notifyUpdateTransform(noDirectionalUpdate));
    }
  }

  public applyMatrix(mat: Matrix): void {
    this.scale = mat.getScaling();
    this.rotation = mat.getRotation();
    this.position = mat.getTranslation();
  }

  @watch("position")
  @watch("scale")
  private _onPositionScaleChange(): void {
    this.notifyUpdateTransform(true);
  }

  @watch("rotation")
  private _onRotationChange(): void {
    this.notifyUpdateTransform(false);
  }

  private _updateTransform(noDirectionalUpdate?: boolean): void {
    if (!this._updatedTransform) {
      return;
    }
    this._updatedTransform = false;
    mat4.fromRotationTranslationScale(this.localTransform.rawElements, this.rotation.rawElements, this.position.rawElements, this.scale.rawElements);
    this._updateGlobalTransform(noDirectionalUpdate);
  }

  /**
   * Update global transoform.
   */
  private _updateGlobalTransform(noDirectionalUpdate?: boolean): void {
    if (!this._parentTransform) {
      mat4.copy(this._globalTransform.rawElements, this.localTransform.rawElements);
    } else {
      mat4.mul(this._globalTransform.rawElements, this._parentTransform.globalTransform.rawElements, this.localTransform.rawElements);
    }
    if (this._globalTransformInverse) { // Once globalTransformInverse was requested from the other class, this will be updated after that frame
      mat4.invert(this._globalTransformInverse.rawElements, this._globalTransform.rawElements);
    }
    if (!noDirectionalUpdate) {
      this._updateDirections();
    }
    this._updateGlobalProperty();
    this.node.emit("transformUpdated", this);
  }

  private _updateDirections(): void {
    vec4.transformMat4(this._forward.rawElements, Transform._forwardBase.rawElements, this.globalTransform.rawElements);
    vec4.transformMat4(this._up.rawElements, Transform._upBase.rawElements, this.globalTransform.rawElements);
    vec4.transformMat4(this._right.rawElements, Transform._rightBase.rawElements, this.globalTransform.rawElements);
  }

  private _updateGlobalProperty(): void {
    if (!this._parentTransform) {
      vec3.copy(this._globalPosition.rawElements, this.position.rawElements);
      vec3.copy(this._globalScale.rawElements, this.scale.rawElements);
      quat.identity(this._globalRotation.rawElements);
    } else {
      vec3.transformMat4(this._globalPosition.rawElements, this.position.rawElements, this._parentTransform.globalTransform.rawElements);
      vec3.transformMat4(this._globalScale.rawElements, this.scale.rawElements, this._parentTransform.globalTransform.rawElements); // TODO buggy
      quat.mul(this._globalRotation.rawElements, this._parentTransform._globalRotation.rawElements, this.rotation.rawElements);
    }
  }

}
