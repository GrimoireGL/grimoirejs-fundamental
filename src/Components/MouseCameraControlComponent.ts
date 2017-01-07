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
      default: 1,//TODO:小数にしたときの挙動
      converter: "Number"
    },
    center: {
      default: null,
      converter: "Number"
    },
    distance: {
      default: null,
      converter: "Number"
    },
    origin: {
      default: "0,0,0",
      converter: "Vector3"
    }
  };

  //propaty bound to
  private _transform: TransformComponent;
  private _rotateSpeed: number;
  private _zoomSpeed: number;
  private _moveSpeed: number;

  private _origin: Vector3;
  private _lastScreenPos: { x: number, y: number } = null;

  private _initialDirection: Vector3;
  private _initialRotation: Quaternion;

  //for rotation axis.
  private _initialRight: Vector3;
  private _initialUp: Vector3;

  private _xsum: number = 0;
  private _ysum: number = 0;

  private _listeners: any;

  public $awake(): void {
    this.getAttributeRaw("rotateSpeed").boundTo("_rotateSpeed");
    this.getAttributeRaw("zoomSpeed").boundTo("_zoomSpeed");
    this.getAttributeRaw("moveSpeed").boundTo("_moveSpeed");
    this.getAttributeRaw("origin").boundTo("_origin");
    this._listeners = {
      mousemove: this._mouseMove.bind(this),
      contextmenu: this._contextMenu.bind(this),
      wheel: this._mouseWheel.bind(this)
    };

    const canvasElement = this.companion.get("canvasElement");
    canvasElement.addEventListener("mousemove", this._listeners.mousemove);
    canvasElement.addEventListener("contextmenu", this._listeners.contextmenu);
    canvasElement.addEventListener("wheel", this._listeners.wheel);
  }

  public $mount(): void {
    const center = this.getAttribute("center");
    let distance = null;
    if (center !== null) {
      console.warn("The attribute 'center' is deprecated now. This attribute would be removed on next version. Use 'distance' instead.");
      distance = center;
    } else {
      distance = this.getAttribute("distance");
    }
    this._transform = this.node.getComponent(TransformComponent);
    this._initialRight = Vector3.copy(this._transform.right);
    this._initialUp = Vector3.copy(this._transform.up);
    this._initialDirection = Vector3.copy(this._transform.forward.negateThis());
    this._initialRotation = this._transform.localRotation;
    const origin = this.getAttribute("origin");
    if (distance !== null) {
      this._origin = this._transform.localPosition.addWith(this._transform.forward.multiplyWith(distance));
    } else {
      this._origin = origin;
    }
  }
  public $dispose() {
    const canvasElement = this.companion.get("canvasElement");
    canvasElement.removeEventListener("mousemove", this._listeners.mousemove);
    canvasElement.removeEventListener("contextmenu", this._listeners.contextmenu);
    canvasElement.removeEventListener("wheel", this._listeners.wheel);
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
    let distance = this._transform.localPosition.subtractWith(this._origin).magnitude;
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
      this._origin = this._origin.addWith(this._transform.right.multiplyWith(moveX)).addWith(this._transform.up.multiplyWith(moveY));
      distance = this._transform.localPosition.subtractWith(this._origin).magnitude;
      updated = true;
    }

    if (updated) {
      // rotate excution
      let rotationVartical = Quaternion.angleAxis(-this._xsum * this._rotateSpeed * 0.01, this._initialUp);
      let rotationHorizontal = Quaternion.angleAxis(-this._ysum * this._rotateSpeed * 0.01, this._initialRight);
      let rotation = Quaternion.multiply(rotationVartical, rotationHorizontal);

      const rotationMat = Matrix.rotationQuaternion(rotation);
      const direction = Matrix.transformNormal(rotationMat, this._initialDirection);
      this._transform.localPosition = this._origin.addWith(Vector3.normalize(direction).multiplyWith(distance));
      this._transform.localRotation = Quaternion.multiply(this._initialRotation, rotation);
    }
    this._lastScreenPos = {
      x: m.screenX,
      y: m.screenY
    };
  }

  private _checkButtonPress(m: MouseEvent, isRight: boolean) {
    if ('buttons' in m) {
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
    let dir = Vector3.normalize(Vector3.subtract(this._transform.localPosition, this._origin));
    let moveDist = -m.deltaY * this._zoomSpeed * 0.05;
    let distance = Vector3.subtract(this._origin, this._transform.localPosition).magnitude;
    let nextDist = Math.max(1, distance - moveDist);
    this._transform.localPosition = this._origin.addWith(dir.multiplyWith(nextDist));
    m.preventDefault();
  }
}
