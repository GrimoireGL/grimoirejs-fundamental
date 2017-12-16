import GLM from "grimoirejs-math/ref/GLM";
import Matrix from "grimoirejs-math/ref/Matrix";
import Quaternion from "grimoirejs-math/ref/Quaternion";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Vector4 from "grimoirejs-math/ref/Vector4";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import CameraComponent from "./CameraComponent";
import HierarchycalComponentBase from "./HierarchicalComponentBase";
const { mat4, vec3, vec4 } = GLM;
/**
 * シーン中に存在する物体の変形を司るコンポーネント
 * このコンポーネントによって物体の座標や回転量、拡大料などが定義されます。
 * シーン中の全ての物体は必ずこのコンポーネントを含まなければなりません。
 */
export default class TransformComponent extends HierarchycalComponentBase {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * この物体の座標
     */
    position: {
      converter: "Vector3",
      default: [0, 0, 0],
    },
    /**
     * この物体の回転量
     */
    rotation: {
      converter: "Rotation3",
      default: [0, 0, 0, 1],
    },
    /**
     * この物体の拡大率
     */
    scale: {
      converter: "Vector3",
      default: [1, 1, 1],
    },
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

  public scale: Vector3;
  public position: Vector3;
  public rotation: Quaternion;

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

  private _matrixTransformMode = false;

  private _updatedTransform = true;

  private _globalTransform: Matrix = new Matrix();

  private _globalTransformInverse: Matrix;

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
      this._globalTransformInverse = Matrix.inverse(this.globalTransform);
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

  public get forward(): Vector3 {
    this._updateTransform();
    return this._forward;
  }

  public get up(): Vector3 {
    this._updateTransform();
    return this._up;
  }

  public get right(): Vector3 {
    this._updateTransform();
    return this._right;
  }

  public calcPVM(camera: CameraComponent): Matrix {
    mat4.mul(this._cachePVM.rawElements, camera.projectionViewMatrix.rawElements, this.globalTransform.rawElements);
    return this._cachePVM;
  }

  public calcVM(camera: CameraComponent): Matrix {
    mat4.mul(this._cacheVM.rawElements, camera.viewMatrix.rawElements, this.globalTransform.rawElements);
    return this._cacheVM;
  }

  public $awake(): void {
    // register observers
    this.getAttributeRaw("position").watch((v) => {
      this.notifyUpdateTransform();
    });
    this.getAttributeRaw("rotation").watch((v) => {
      this.notifyUpdateTransform();
    });
    this.getAttributeRaw("scale").watch((v) => {
      this.notifyUpdateTransform();
    });
    // assign attribute values to field
    this.__bindAttributes();
  }

  public $mount(): void {
    super.$mount();
    this._parentTransform = this.node.parent.getComponent(TransformComponent);
    if (this._parentTransform) {
      this._parentTransform._children.push(this);
    }
    this._updateTransform();
  }

  public $unmount(): void {
    super.$unmount();
    if (this._parentTransform) {
      this._parentTransform._children.splice(this._parentTransform._children.indexOf(this), 1);
      this._parentTransform = null;
    }
  }

  public notifyUpdateTransform(): void {
    if (!this._updatedTransform) {
      this._updatedTransform = true;
      this._children.forEach(c => c.notifyUpdateTransform());
    }
  }

  public applyMatrix(mat: Matrix): void {
    this.setAttribute("scale", mat.getScaling());
    this.setAttribute("rotation", mat.getRotation());
    this.setAttribute("position", mat.getTranslation());
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
    vec4.transformMat4(this._forward.rawElements, TransformComponent._forwardBase.rawElements, this.globalTransform.rawElements);
    vec4.transformMat4(this._up.rawElements, TransformComponent._upBase.rawElements, this.globalTransform.rawElements);
    vec4.transformMat4(this._right.rawElements, TransformComponent._rightBase.rawElements, this.globalTransform.rawElements);
  }

  private _updateGlobalProperty(): void {
    if (!this._parentTransform) {
      vec3.copy(this._globalPosition.rawElements, this.position.rawElements);
      vec3.copy(this._globalScale.rawElements, this.scale.rawElements);
    } else {
      vec3.transformMat4(this._globalPosition.rawElements, this.position.rawElements, this._parentTransform.globalTransform.rawElements);
      vec3.transformMat4(this._globalScale.rawElements, this.scale.rawElements, this._parentTransform.globalTransform.rawElements); // TODO buggy
    }
  }

}
