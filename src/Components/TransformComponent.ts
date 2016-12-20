import CameraComponent from "./CameraComponent";
import gr from "grimoirejs";
import Matrix from "grimoirejs-math/ref/Matrix";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Vector4 from "grimoirejs-math/ref/Vector4";
import Quaternion from "grimoirejs-math/ref/Quaternion";
import GLM from "grimoirejs-math/ref/GLM";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
const {mat4, vec3, vec4} = GLM;
/**
 * Provides object transformation like translation,rotation,scaling.
 */
export default class TransformComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    "position": {
      converter: "Vector3",
      default: Vector3.Zero
    },
    "rotation": {
      converter: "Rotation3",
      default: Quaternion.Identity
    },
    "scale": {
      converter: "Vector3",
      default: Vector3.One
    },
    "rawMatrix": {
      converter: "Object", // TODO should implement Matrix converter
      default: null
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

  private _cacheVM: Matrix = new Matrix();
  /**
   * Cache for position
   * @type {Vector3}
   */
  private _localPosition: Vector3;

  /**
   * Cache for rotation
   * @type {Quaternion}
   */
  private _localRotation: Quaternion;

  /**
   * Cache for scaling
   * @type {Vector3}
   */
  private _localScale: Vector3;

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

  private _globalPosition: Vector3 = new Vector3([0, 0, 0]);

  private _globalScale: Vector3 = new Vector3([1, 1, 1]);

  private _matrixTransformMode: boolean = false;

  public get globalPosition(): Vector3 {
    return this._globalPosition;
  }

  public get localPosition(): Vector3 {
    return this._localPosition;
  }

  public set localPosition(val: Vector3) {
    this._localPosition = val;
    this.setAttribute("position", val);
  }

  public get localRotation(): Quaternion {
    return this._localRotation;
  }

  public set localRotation(val: Quaternion) {
    this._localRotation = val;
    this.setAttribute("rotation", val);
  }

  public get globalScale(): Vector3 {
    return this._globalScale;
  }

  public get localScale(): Vector3 {
    return this._localScale;
  }

  public set localScale(val: Vector3) {
    this._localScale = val;
    this.setAttribute("scale", val);
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

  public calcPVM(camera: CameraComponent): Matrix {
    mat4.mul(this._cachePVM.rawElements, camera.camera.getProjectionViewMatrix().rawElements, this.globalTransform.rawElements);
    return this._cachePVM;
  }

  public calcVM(camera: CameraComponent): Matrix {
    mat4.mul(this._cacheVM.rawElements, camera.camera.getViewMatrix().rawElements, this.globalTransform.rawElements);
    return this._cacheVM;
  }

  public $awake(): void {
    // register observers
    this.getAttributeRaw("position").watch((v) => {
      this._localPosition = v;
      this._matrixTransformMode = false;
      this.updateTransform(true);
    });
    this.getAttributeRaw("rotation").watch((v) => {
      this._localRotation = v;
      this._matrixTransformMode = false;
      this.updateTransform();
    });
    this.getAttributeRaw("scale").watch((v) => {
      this._localScale = v;
      this._matrixTransformMode = false;
      this.updateTransform(true);
    });
    this.getAttributeRaw("rawMatrix").watch((v) => {
      if (v !== null) {
        const mat = v as Matrix;
        this._matrixTransformMode = true;
        // TODO should be addded?
        // mat4.getTranslation(this._localPosition.rawElements, mat.rawElements);
        // mat4.getScaling(this._localScale.rawElements, mat.rawElements);
        // mat4.getRotation(this._localRotation.rawElements, mat.rawElements);
        this.localTransform = mat;
        this.updateGlobalTransform();
      }
    });
    // assign attribute values to field
    this._localPosition = this.getAttribute("position");
    this._localRotation = this.getAttribute("rotation");
    this._localScale = this.getAttribute("scale");
    this.updateTransform();
  }

  public $mount(): void {
    this._parentTransform = this.node.parent.getComponent(TransformComponent);
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
  public updateTransform(noDirectionalUpdate?: boolean): void {
    if (!this._matrixTransformMode) {
      mat4.fromRotationTranslationScale(this.localTransform.rawElements, this._localRotation.rawElements, this._localPosition.rawElements, this._localScale.rawElements);
    }
    this.updateGlobalTransform(noDirectionalUpdate);
  }
  /**
   * Update global transoform.
   */
  public updateGlobalTransform(noDirectionalUpdate?: boolean): void {
    if (!this._parentTransform) {
      mat4.copy(this.globalTransform.rawElements, this.localTransform.rawElements);
    } else {
      mat4.mul(this.globalTransform.rawElements, this._parentTransform.globalTransform.rawElements, this.localTransform.rawElements);
    }
    if (noDirectionalUpdate) {
      this._updateDirections();
    }
    this._updateGlobalProperty();
    this.node.emit("transformUpdated", this);
    this._children.forEach((v) => v.updateGlobalTransform(noDirectionalUpdate));
  }

  private _updateDirections(): void {
    vec4.transformMat4(this._forward.rawElements, TransformComponent._forwardBase.rawElements, this.globalTransform.rawElements);
    vec4.transformMat4(this._up.rawElements, TransformComponent._upBase.rawElements, this.globalTransform.rawElements);
    vec4.transformMat4(this._right.rawElements, TransformComponent._rightBase.rawElements, this.globalTransform.rawElements);
  }

  private _updateGlobalProperty(): void {
    if (!this._parentTransform) {
      vec3.copy(this._globalPosition.rawElements, this._localPosition.rawElements);
      vec3.copy(this._globalScale.rawElements, this._localScale.rawElements);
    } else {
      vec3.transformMat4(this._globalPosition.rawElements, this._localPosition.rawElements, this._parentTransform.globalTransform.rawElements);
      vec3.transformMat4(this._globalScale.rawElements, this._localScale.rawElements, this._parentTransform.globalTransform.rawElements); // TODO buggy
    }
  }

}

