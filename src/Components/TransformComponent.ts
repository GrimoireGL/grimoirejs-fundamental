import Matrix from "../../node_modules/grimoirejs/lib/Core/Math/Matrix";
import {mat4} from "gl-matrix";
import Quaternion from "grimoirejs/lib/Core/Math/Quaternion";
import Component from "grimoirejs/lib/Core/Node/Component";
import Vector3 from "grimoirejs/lib/Core/Math/Vector3";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

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

  private _parentTransform: TransformComponent;

  private _observers: ((t: TransformComponent) => void)[] = [];

  public localTransform: Matrix = new Matrix();

  public globalTransform: Matrix = new Matrix();

  public position: Vector3;

  public rotation: Vector3;

  public scale: Vector3;

  public children: TransformComponent[] = [];

  public addChildren(child: TransformComponent): void {
    this.children.push(child);
  }

  public removeChildren(child: TransformComponent): void {
    let index: number = -1;
    for (let i = 0; i < this.children.length; i++) {
      if (this.children[i] === child) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      this.children.splice(index, 1);
    }
  }

  public removeObserver(observer: (t: TransformComponent) => void): void {
    let index: number = -1;
    for (let i = 0; i < this._observers.length; i++) {
      if (this._observers[i] === observer) {
        index = i;
        break;
      }
    }
    if (index >= 0) {
      this._observers.splice(index, 1);
    }
  }

  public addObserver(observer: (t: TransformComponent) => void): void {
    this._observers.push(observer);
  }

  public $awake(): void {
    this.attributes.get("position").addObserver(() => this.updateTransform());
    this.attributes.get("rotation").addObserver(() => this.updateTransform());
    this.attributes.get("scale").addObserver(() => this.updateTransform());
  }

  public $mount(): void {
    this._parentTransform = this.node.parent.getComponent("Transform") as TransformComponent;
    if (this._parentTransform) {
      this._parentTransform.addChildren(this);
    }
    this.updateTransform();
  }

  public $unmount(): void {
    this._parentTransform = null;
    this.children.splice(0, this.children.length);
  }

  public updateTransform(): void {
    this.position = this.attributes.get("position").Value;
    this.rotation = this.attributes.get("rotation").Value;
    this.scale = this.attributes.get("scale").Value;
    mat4.fromRotationTranslationScale(this.localTransform.rawElements, this.rotation.rawElements, this.position.rawElements, this.scale.rawElements);
    this.updateGlobalTransform(false);
  }

  public updateGlobalTransform(updateChildren = true): void {
    if (!this._parentTransform) {
      mat4.copy(this.globalTransform.rawElements, this.localTransform.rawElements);
    } else {
      mat4.mul(this.globalTransform.rawElements, this._parentTransform.globalTransform.rawElements, this.localTransform.rawElements);
    }
    if (updateChildren) {
      this.children.forEach((v) => v.updateGlobalTransform());
    }
  }

}
