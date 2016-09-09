import {Matrix, Vector3, Vector4, Quaternion} from "grimoirejs-math";
import ICamera from "../Camera/ICamera";
import {mat4, vec3, vec4} from "gl-matrix";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";
/**
 * Provides object transformation like translation,rotation,scaling.
 */
export default class TransformComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    "position": {
      converter: "vector3",
      defaultValue: Vector3.Zero
    },
    "rotation": {
      converter: "rotation3",
      defaultValue: Quaternion.Identity
    },
    "scale": {
      converter: "vector3",
      defaultValue: Vector3.One
    }
  };
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
   * Global transform that consider parent transform and local transform
   * @return {[type]} [description]
   */
  public globalTransform: Matrix = new Matrix();

  /**
   * The children transform should be notified when this transform was updated.
   * @type {TransformComponent[]}
   */
  private _children: TransformComponent[] = [];

  /**
   * The reference to parent TransformComponent.
   * When this object is root object of contained scene, this value should be null.
   * @type {TransformComponent}
   */
  private _parentTransform: TransformComponent;

  /**
   * Calculation cache to
   * @return {[type]} [description]
   */
  private _cachePVM: Matrix = new Matrix();
  /**
   * Cache for position
   * @type {Vector3}
   */
  private _position: Vector3;

  /**
   * Cache for rotation
   * @type {Quaternion}
   */
  private _rotation: Quaternion;

  /**
   * Cache for scaling
   * @type {Vector3}
   */
  private _scale: Vector3;

  /**
   * Cache of forward direction of this object
   */
  private _forward: Vector3 = new Vector3([0, 0, -1, 0]);

  /**
   * Cache of up direction of this object.
   */
  private _up: Vector3 = new Vector3([0, 1, 0, 0]);

  /**
   * Cache of right direction of this object.
   */
  private _right: Vector3 = new Vector3([1, 0, 0, 0]);

  public get position(): Vector3 {
    return this._position;
  }

  public set position(val: Vector3) {
    this._position = val;
    this.attributes.get("position").Value = val;
  }

  public get rotation(): Quaternion {
    return this._rotation;
  }

  public set rotation(val: Quaternion) {
    this._rotation = val;
    this.attributes.get("rotation").Value = val;
  }

  public get scale(): Vector3 {
    return this._scale;
  }

  public set scale(val: Vector3) {
    this._scale = val;
    this.attributes.get("scale").Value = val;
  }

  public get forward(): Vector3 {
    return this._forward;
  }

  public get up(): Vector3 {
    return this._up;
  }

  public get right(): Vector3 {
    return this._right;
  }

  public calcPVW(camera: ICamera): Matrix {
    mat4.mul(this._cachePVM.rawElements, camera.getProjectionViewMatrix().rawElements, this.globalTransform.rawElements);
    return this._cachePVM;
  }

  public $awake(): void {
    // register observers
    this.attributes.get("position").addObserver(() => this.updateTransform());
    this.attributes.get("rotation").addObserver(() => this.updateTransform());
    this.attributes.get("scale").addObserver(() => this.updateTransform());
    // assign attribute values to field
    this._position = this.attributes.get("position").Value;
    this._rotation = this.attributes.get("rotation").Value;
    this._scale = this.attributes.get("scale").Value;
    this.updateTransform();
  }


  public $mount(): void {
    this._parentTransform = this.node.parent.getComponent("Transform") as TransformComponent;
    if (this._parentTransform) {
      this._parentTransform._children.push(this);
    }
    this.updateTransform();
  }

  public $unmount(): void {
    if (this._parentTransform) {
      this._parentTransform._children.splice(this._parentTransform._children.indexOf(this), 1);
      this._parentTransform = null;
    }
  }

  /**
   * update local transform and global transform.
   * This need to be called if you manually edit raw elements of scale,position or rotation to recalculate transform matricies.
   */
  public updateTransform(): void {
    mat4.fromRotationTranslationScale(this.localTransform.rawElements, this._rotation.rawElements, this._position.rawElements, this._scale.rawElements);
    this.updateGlobalTransform();
  }
  /**
   * Update global transoform.
   */
  public updateGlobalTransform(): void {
    if (!this._parentTransform) {
      mat4.copy(this.globalTransform.rawElements, this.localTransform.rawElements);
    } else {
      mat4.mul(this.globalTransform.rawElements, this._parentTransform.globalTransform.rawElements, this.localTransform.rawElements);
    }
    this._updateDirections();
    this.node.sendMessage("transformUpdated", this);
    this._children.forEach((v) => v.updateGlobalTransform());
  }

  private _updateDirections(): void {
    vec4.transformMat4(this._forward.rawElements, TransformComponent._forwardBase.rawElements, this.globalTransform.rawElements);
    vec4.transformMat4(this._up.rawElements, TransformComponent._upBase.rawElements, this.globalTransform.rawElements);
    vec4.transformMat4(this._right.rawElements, TransformComponent._rightBase.rawElements, this.globalTransform.rawElements);
  }

}
