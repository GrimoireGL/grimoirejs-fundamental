import Attribute from "grimoirejs/lib/Node/Attribute";
import {Quaternion, Vector3, Matrix} from "grimoirejs-math";
import TransformComponent from "./TransformComponent";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";

export default class MouseCameraControlComponent extends Component {
  public static rotateCoefficient: number = 0.003;

  public static moveCoefficient: number = 0.05;

  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
    rotateX: {
      defaultValue: 1,
      converter: "Number"
    },
    rotateY: {
      defaultValue: 1,
      converter: "Number"
    },
    moveZ: {
      defaultValue: 1,
      converter: "Number"
    },
    moveSpeed: {
      defaultValue: 1,
      converter: "Number"
    }

  };

  private _transform: TransformComponent;

  private _scriptTag: HTMLScriptElement;

  private _lastScreenPos: { x: number, y: number } = { x: NaN, y: NaN };

  private _rotateX: number;

  private _rotateY: number;

  private _moveZ: number;

  private _origin: Vector3 = new Vector3(0, 0, 0);

  private _moveSpeed: number;

  private _xsum: number = 0;

  private _ysum: number = 0;

  private _initialDirection: Vector3;

  private _initialRotation: Quaternion;

  private _distance: number;

  public $awake(): void {
    this.getAttribute("rotateX").boundTo("_rotateX");
    this.getAttribute("rotateY").boundTo("_rotateY");
    this.getAttribute("moveZ").boundTo("_moveZ");
    this.getAttribute("moveSpeed").boundTo("_moveSpeed");
    this._transform = this.node.getComponent("Transform") as TransformComponent;
    this._scriptTag = this.companion.get("canvasElement");
  }

  public $mount(): void {
    this._scriptTag.addEventListener("mousemove", this._mouseMove.bind(this));
    this._scriptTag.addEventListener("contextmenu", this._contextMenu.bind(this));
    this._scriptTag.addEventListener("mousewheel", this._mouseWheel.bind(this));
    this._distance = Math.sqrt(Vector3.dot(this._transform.localPosition.subtractWith(this._origin), this._transform.localPosition.subtractWith(this._origin)));
  }

  private _contextMenu(m: MouseEvent): void {
    m.preventDefault();
  }

  private _mouseMove(m: MouseEvent): void {
    console.log(Math.sqrt(Vector3.dot(this._transform.localPosition, this._transform.localPosition)));
    if (isNaN(this._lastScreenPos.x)) {
      this._initialDirection = this._transform.localPosition.subtractWith(this._origin);
      this._initialRotation = this._transform.localRotation;
      this._lastScreenPos = {
        x: m.screenX,
        y: m.screenY
      };
    }
    let updated = false;
    const diffX = m.screenX - this._lastScreenPos.x, diffY = m.screenY - this._lastScreenPos.y;
    if ((m.buttons & 1) > 0) { // When left button was pressed
      this._xsum += diffX;
      this._ysum += diffY;
      updated = true;
    }
    if ((m.buttons & 2) > 0) { // When right button was pressed
      this._origin = this._origin.addWith(this._transform.right.multiplyWith(-diffX * 0.05 * this._moveSpeed)).addWith(this._transform.up.multiplyWith(diffY * 0.05 * this._moveSpeed));
      updated = true;
      this._distance = Math.sqrt(Vector3.dot(this._transform.localPosition.subtractWith(this._origin), this._transform.localPosition.subtractWith(this._origin)));
    }

    if (updated) {
      const rotation = Quaternion.euler(this._ysum * 0.01, this._xsum * 0.01, 0);
      const rotationMat = Matrix.rotationQuaternion(rotation);
      const direction = Matrix.transformNormal(rotationMat, this._initialDirection);
      this._transform.localPosition = this._origin.addWith(Vector3.normalize(direction).multiplyWith(this._distance));
      this._transform.localRotation = Quaternion.multiply(this._initialRotation, rotation);
    }
    this._lastScreenPos = {
      x: m.screenX,
      y: m.screenY
    };
  }

  private _mouseWheel(m: MouseWheelEvent): void {
    this._distance -= m.deltaY * this._moveZ * MouseCameraControlComponent.moveCoefficient;
    this._transform.localPosition = this._transform.localPosition.addWith(this._transform.forward.multiplyWith(m.deltaY * this._moveZ * MouseCameraControlComponent.moveCoefficient));
    m.preventDefault();
  }
}
