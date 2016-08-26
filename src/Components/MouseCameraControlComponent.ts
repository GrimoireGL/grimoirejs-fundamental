import Attribute from "grimoirejs/lib/Core/Node/Attribute";
import {Quaternion} from "grimoirejs-math";
import TransformComponent from "./TransformComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

export default class MouseCameraControlComponent extends Component {
  public static rotateCoefficient = 0.003;

  public static moveCoefficient = 0.05;
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
    rotateX: {
      defaultValue: 1,
      converter: "number"
    },
    rotateY: {
      defaultValue: 1,
      converter: "number"
    },
    moveZ: {
      defaultValue: 1,
      converter: "number"
    }

  };

  private transform: TransformComponent;

  private scriptTag: HTMLScriptElement;

  private lastScreenPos: { x: number, y: number } = { x: NaN, y: NaN };

  private _rotateXAttr: Attribute;

  private _rotateYAttr: Attribute;

  private _moveZAttr: Attribute;

  public $awake(): void {
    this.transform = this.node.getComponent("Transform") as TransformComponent;
    this.scriptTag = this.companion.get("canvasElement");
    this._rotateXAttr = this.attributes.get("rotateX");
    this._rotateYAttr = this.attributes.get("rotateY");
    this._moveZAttr = this.attributes.get("moveZ");
  }

  public $mount(): void {
    this.scriptTag.addEventListener("mousemove", this._mouseMove.bind(this));
    this.scriptTag.addEventListener("mousewheel", this._mouseWheel.bind(this));
  }

  public $unmount(): void {

  }

  public $update(): void {

  }

  private _mouseMove(m: MouseEvent): void {
    if (isNaN(this.lastScreenPos.x)) {
      this.lastScreenPos = {
        x: m.screenX,
        y: m.screenY
      };
    }
    if ((m.buttons & 1) > 0) { // When left button was pressed
      const diffX = m.screenX - this.lastScreenPos.x, diffY = m.screenY - this.lastScreenPos.y;
      this.transform.rotation = Quaternion.multiply(
        this.transform.rotation,
        Quaternion.eulerXYZ(diffY * MouseCameraControlComponent.rotateCoefficient * this._rotateYAttr.Value, diffX * MouseCameraControlComponent.rotateCoefficient * this._rotateXAttr.Value, 0));
    }
    this.lastScreenPos = {
      x: m.screenX,
      y: m.screenY
    };
  }

  private _mouseWheel(m: MouseWheelEvent): void {
    this.transform.position = this.transform.position.addWith(this.transform.forward.multiplyWith(m.deltaY * this._moveZAttr.Value * MouseCameraControlComponent.moveCoefficient));
  }
}
