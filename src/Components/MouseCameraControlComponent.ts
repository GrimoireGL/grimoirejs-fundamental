import Matrix from "grimoirejs-math/ref/Matrix";
import Quaternion from "grimoirejs-math/ref/Quaternion";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import TransformComponent from "./TransformComponent";

export default class MouseCameraControlComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    rotateSpeed: {
      default: 1,
      converter: "Number",
    },
    zoomSpeed: {
      default: 1,
      converter: "Number",
    },
    moveSpeed: {
      default: 1,
      converter: "Number",
    },
    center: {
      default: "0,0,0",
      converter: "Position",
      lazy: true,
    },
    distance: {
      default: null,
      converter: "Number",
    },
    preventScroll: {
      default: true,
      converter: "Boolean",
    },
  };

  // propaty bound to
  public rotateSpeed: number;
  public zoomSpeed: number;
  public moveSpeed: number;
  public center: Vector3;
  public distance: number;
  private _transform: TransformComponent;
  private _updated = false;

  private _lastCenter: Vector3 = null;

  private _lastScreenPos: { x: number, y: number } = null;

  private _initialDirection: Vector3;
  private _initialRotation: Quaternion;

  private _xsum = 0;

  private _ysum = 0;

  private _d: Vector3 = Vector3.Zero;

  private _listeners: any;

  public $awake(): void {
    this.__bindAttributes();
    this._listeners = {
      mousemove: this._mouseMove.bind(this),
      contextmenu: this._contextMenu.bind(this),
      wheel: this._mouseWheel.bind(this),
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
    const look = Vector3.normalize(this.center.subtractWith(this._transform.position));
    const g = Quaternion.fromToRotation(this._transform.forward, look).normalize();
    this._transform.rotation = g;
    this._initialRotation = g;
    this._initialDirection = Vector3.copy(this._transform.forward.negateThis()).normalized;

    if (this.distance !== null) {
      this._transform.position = this.center.addWith(this._initialDirection.multiplyWith(this.distance));
    } else {
      this.distance = this._transform.position.subtractWith(this.center).magnitude;
    }
  }
  public $update() {
    if (this.isActive && this._updated || !this._lastCenter || !this.center.equalWith(this._lastCenter)) {
      this._updated = false;
      this._lastCenter = this.center;

      // rotate excution
      const rotationVartical = Quaternion.angleAxis(-this._xsum * this.rotateSpeed * 0.01, Vector3.YUnit);
      const rotationHorizontal = Quaternion.angleAxis(-this._ysum * this.rotateSpeed * 0.01, Vector3.XUnit);
      const rotation = Quaternion.multiply(rotationVartical, rotationHorizontal);

      const rotationMat = Matrix.rotationQuaternion(rotation);
      const direction = Matrix.transformNormal(rotationMat, this._initialDirection);
      this._transform.position = this.center.addWith(this._d).addWith(Vector3.normalize(direction).multiplyWith(this.distance));
      this._transform.rotation = rotation;
      this._transform.rotation = Quaternion.multiply(rotation, this._initialRotation);
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
        y: m.screenY,
      };
      return;
    }

    const diffX = m.screenX - this._lastScreenPos.x;
    const diffY = m.screenY - this._lastScreenPos.y;
    if (this._checkButtonPress(m, true)) { // When left button was pressed
      this._xsum += diffX;
      this._ysum += diffY;
      this._ysum = Math.min(Math.PI * 50, this._ysum);
      this._ysum = Math.max(-Math.PI * 50, this._ysum);
      this._updated = true;
    }
    if (this._checkButtonPress(m, false)) { // When right button was pressed, move origin.
      const moveX = -diffX * this.moveSpeed * 0.01;
      const moveY = diffY * this.moveSpeed * 0.01;
      this._d = this._d.addWith(this._transform.right.multiplyWith(moveX)).addWith(this._transform.up.multiplyWith(moveY));
      this._updated = true;
    }

    this._lastScreenPos = {
      x: m.screenX,
      y: m.screenY,
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
    const dir = Vector3.subtract(this._transform.position, this.center).normalized;
    const moveDist = m.deltaY * this.zoomSpeed * 0.05;
    this.distance = Math.max(1, this.distance + moveDist);
    this._transform.position = this.center.addWith(dir.multiplyWith(this.distance));
    if (this.getAttribute("preventScroll")) {
      m.preventDefault();
    }
  }
}
