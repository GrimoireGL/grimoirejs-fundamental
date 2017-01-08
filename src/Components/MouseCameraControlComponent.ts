import SceneComponent from "./SceneComponent";
import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Quaternion from "grimoirejs-math/ref/Quaternion";
import Matrix from "grimoirejs-math/ref/Matrix";
import TransformComponent from "./TransformComponent";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

export default class MouseCameraControlComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    rotateSpeed: {
      default: 1,
      converter: "Number"
    },
    zoomSpeed: {
      default: 1,
      converter: "Number"
    },
    moveSpeed: {
      default: 1,
      converter: "Number"
    },
    center: {
      default: "0,0,0",
      converter: "Position",
      lazy: true
    },
    distance: {
      default: null,
      converter: "Number"
    }
  };

  // propaty bound to
  private _transform: TransformComponent;
  private _rotateSpeed: number;
  private _zoomSpeed: number;
  private _moveSpeed: number;
  private _center: Vector3;
  private _distance: number;

  private _lastScreenPos: { x: number, y: number } = null;

  private _initialDirection: Vector3;
  private _initialRotation: Quaternion;

  private _xsum: number = 0;
  private _ysum: number = 0;

  private _d: Vector3 = Vector3.Zero;

  private _listeners: any;

  public $awake(): void {
    this.__bindAttributes();
    this._listeners = {
      mousemove: this._mouseMove.bind(this),
      contextmenu: this._contextMenu.bind(this),
      wheel: this._mouseWheel.bind(this)
    };
  }

  public $mount(): void {
    this._transform = this.node.getComponent(TransformComponent);
    const canvasElement = this.companion.get("canvasElement");
    canvasElement.addEventListener("mousemove", this._listeners.mousemove);
    canvasElement.addEventListener("contextmenu", this._listeners.contextmenu);
    canvasElement.addEventListener("wheel", this._listeners.wheel);

    this._lastScreenPos = null;
    this._xsum = 0;
    this._ysum = 0;
  }
  public $unmount() {
    const canvasElement = this.companion.get("canvasElement");
    canvasElement.removeEventListener("mousemove", this._listeners.mousemove);
    canvasElement.removeEventListener("contextmenu", this._listeners.contextmenu);
    canvasElement.removeEventListener("wheel", this._listeners.wheel);
  }

  public $initialized() {
    let look = Vector3.normalize(this._center.subtractWith(this._transform.localPosition));
    let g = Quaternion.fromToRotation(this._transform.forward, look).normalize();
    this._transform.localRotation = g;
    this._initialRotation = g;
    this._initialDirection = Vector3.copy(this._transform.forward.negateThis()).normalized;

    if (this._distance !== null) {
      this._transform.localPosition = this._center.addWith(this._initialDirection.multiplyWith(this._distance));
    } else {
      this._distance = this._transform.localPosition.subtractWith(this._center).magnitude;
    }
  }

  private _contextMenu(m: MouseEvent): void {
    if (!this.isActive) {
      return;
    }
    m.preventDefault();
  }

  private _mouseMove(m: MouseEvent): void {
    if (!this.isActive) {
      return;
    }
    if (this._lastScreenPos === null) {
      this._lastScreenPos = {
        x: m.screenX,
        y: m.screenY
      };
      return;
    }

    let updated = false;
    const diffX = m.screenX - this._lastScreenPos.x;
    const diffY = m.screenY - this._lastScreenPos.y;
    if (this._checkButtonPress(m, true)) { // When left button was pressed
      this._xsum += diffX;
      this._ysum += diffY;
      this._ysum = Math.min(Math.PI * 50, this._ysum);
      this._ysum = Math.max(-Math.PI * 50, this._ysum);
      updated = true;
    }
    if (this._checkButtonPress(m, false)) { // When right button was pressed, move origin.
      let moveX = -diffX * this._moveSpeed * 0.01;
      let moveY = diffY * this._moveSpeed * 0.01;
      this._d = this._d.addWith(this._transform.right.multiplyWith(moveX)).addWith(this._transform.up.multiplyWith(moveY));
      updated = true;
    }

    if (updated) {
      // rotate excution
      let rotationVartical = Quaternion.angleAxis(-this._xsum * this._rotateSpeed * 0.01, Vector3.YUnit);
      let rotationHorizontal = Quaternion.angleAxis(-this._ysum * this._rotateSpeed * 0.01, Vector3.XUnit);
      let rotation = Quaternion.multiply(rotationVartical, rotationHorizontal);

      const rotationMat = Matrix.rotationQuaternion(rotation);
      const direction = Matrix.transformNormal(rotationMat, this._initialDirection);
      this._transform.localPosition = this._center.addWith(this._d).addWith(Vector3.normalize(direction).multiplyWith(this._distance));
      this._transform.localRotation = rotation;
      this._transform.localRotation = Quaternion.multiply(rotation, this._initialRotation);
    }
    this._lastScreenPos = {
      x: m.screenX,
      y: m.screenY
    };
  }

  private _checkButtonPress(m: MouseEvent, isRight: boolean) {
    if ("buttons" in m) {
      if (isRight) {
        return (m.buttons & 1) > 0;
      } else {
        return (m.buttons & 2) > 0;
      }
    } else {
      if (isRight) {
        return m.which === 1;
      } else {
        return m.which === 3;
      }
    }
  }

  private _mouseWheel(m: MouseWheelEvent): void {
    if (!this.isActive) {
      return;
    }
    let dir = Vector3.subtract(this._transform.localPosition, this._center).normalized;
    let moveDist = m.deltaY * this._zoomSpeed * 0.05;
    this._distance = Math.max(1, this._distance + moveDist);
    this._transform.localPosition = this._center.addWith(dir.multiplyWith(this._distance));
    m.preventDefault();
  }
}
