import Attribute from "grimoirejs/lib/Core/Node/Attribute";
import {Quaternion, Vector3, Matrix} from "grimoirejs-math";
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
      converter: "number",
      boundTo: "_rotateX"
    },
    rotateY: {
      defaultValue: 1,
      converter: "number",
      boundTo: "_rotateY"
    },
    moveZ: {
      defaultValue: 1,
      converter: "number",
      boundTo: "_moveZ"
    },
    moveSpeed:{
      defaultValue:1,
      converter:"number",
      boundTo: "_moveSpeed"
    }

  };

  private transform: TransformComponent;

  private scriptTag: HTMLScriptElement;

  private lastScreenPos: { x: number, y: number } = { x: NaN, y: NaN };

  private _rotateX: number;

  private _rotateY: number;

  private _moveZ: number;

  private _origin: Vector3 = new Vector3(0, 0, 0);

  private _moveSpeed: number;

  private _xsum: number = 0;

  private _ysum: number = 0;

  private _initialDirection: Vector3;

  private _initialRotation: Quaternion;

  public $awake(): void {
    this.transform = this.node.getComponent("Transform") as TransformComponent;
    this.scriptTag = this.companion.get("canvasElement");
  }

  public $mount(): void {
    this.scriptTag.addEventListener("mousemove", this._mouseMove.bind(this));
    this.scriptTag.addEventListener("contextmenu", this._contextMenu.bind(this));
    this.scriptTag.addEventListener("mousewheel", this._mouseWheel.bind(this));
  }

  private _contextMenu(m: MouseEvent): void {
    m.preventDefault();
  }

  private _mouseMove(m: MouseEvent): void {
    if (isNaN(this.lastScreenPos.x)) {
      this._initialDirection = this.transform.position.subtractWith(this._origin);
      this._initialRotation = this.transform.rotation;
      this.lastScreenPos = {
        x: m.screenX,
        y: m.screenY
      };
    }
    let updated = false;
    const diffX = m.screenX - this.lastScreenPos.x, diffY = m.screenY - this.lastScreenPos.y;
    if ((m.buttons & 1) > 0) { // When left button was pressed
      this._xsum += diffX;
      this._ysum += diffY;
      updated = true;
    }
    if ((m.buttons & 2) > 0) {
      this._origin = this._origin.addWith(this.transform.right.multiplyWith(-diffX * 0.05 * this._moveSpeed)).addWith(this.transform.up.multiplyWith(diffY * 0.05 * this._moveSpeed));
      updated = true;
    }

    if (updated) {
      const rotation = Quaternion.euler(this._ysum * 0.01, this._xsum * 0.01, 0);
      const rotationMat = Matrix.rotationQuaternion(rotation);
      const direction = Matrix.transformNormal(rotationMat, this._initialDirection);
      this.transform.position = this._origin.addWith(direction);
      this.transform.rotation = Quaternion.multiply(this._initialRotation, rotation);
    }
    this.lastScreenPos = {
      x: m.screenX,
      y: m.screenY
    };
  }

  private _mouseWheel(m: MouseWheelEvent): void {
    this.transform.position = this.transform.position.addWith(this.transform.forward.multiplyWith(m.deltaY * this._moveZ * MouseCameraControlComponent.moveCoefficient));
  }
}
