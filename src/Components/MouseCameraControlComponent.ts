import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import {Quaternion, Vector3, Matrix} from "grimoirejs-math";
import TransformComponent from "./TransformComponent";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

export default class MouseCameraControlComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    rotateSpeed: {
      defaultValue: 0.01,
      converter: "Number"
    },
    zoomSpeed: {
      defaultValue: 0.05,
      converter: "Number"
    },
    moveSpeed: {
      defaultValue: 1,//TODO:小数にしたときの挙動
      converter: "Number"
    },
    center: {
      defaultValue: 20,
      converter: "Number"
    }
  };

  //propaty bound to
  private _transform: TransformComponent;
  private _rotateSpeed: number;
  private _zoomSpeed: number;
  private _moveSpeed: number;

  private _origin: Vector3 = new Vector3(0, 0, 0);
  private _lastScreenPos: { x: number, y: number } = null;

  private _initialDirection: Vector3;
  private _initialRotation: Quaternion;

  //for rotation axis.
  private _initialRight: Vector3;
  private _initialUp: Vector3;

  private _xsum: number = 0;
  private _ysum: number = 0;

  private _center: number = 0;
  public $awake(): void {
    this.getAttribute("center").boundTo("_center");
    this.getAttribute("rotateSpeed").boundTo("_rotateSpeed");
    this.getAttribute("zoomSpeed").boundTo("_zoomSpeed");
    this.getAttribute("moveSpeed").boundTo("_moveSpeed");
    this._transform = this.node.getComponent("Transform") as TransformComponent;
  }

  public $mount(): void {
    this._initialRight = Vector3.copy(this._transform.right);
    this._initialUp = Vector3.copy(this._transform.up);
    this._initialDirection = this._transform.localPosition.subtractWith(this._origin);
    this._initialRotation = this._transform.localRotation;
    this._origin =this._transform.localPosition.addWith(this._transform.forward.multiplyWith(this._center));
    let scriptTag = this.companion.get("canvasElement");
    scriptTag.addEventListener("mousemove", this._mouseMove.bind(this));
    scriptTag.addEventListener("contextmenu", this._contextMenu.bind(this));
    scriptTag.addEventListener("mousewheel", this._mouseWheel.bind(this));
  }

  private _contextMenu(m: MouseEvent): void {
    m.preventDefault();
  }

  private _mouseMove(m: MouseEvent): void {
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
    if ((m.buttons & 1) > 0) { // When left button was pressed
      this._xsum += diffX;
      this._ysum += diffY;
      this._ysum = Math.min(Math.PI * 50, this._ysum);
      this._ysum = Math.max(-Math.PI * 50, this._ysum);
      updated = true;
    }
    if ((m.buttons & 2) > 0) { // When right button was pressed, move origin.
      let moveX = -diffX * this._moveSpeed * 0.01;
      let moveY = diffY * this._moveSpeed * 0.01;
      this._origin = this._origin.addWith(this._transform.right.multiplyWith(moveX)).addWith(this._transform.up.multiplyWith(moveY));
      distance = this._transform.localPosition.subtractWith(this._origin).magnitude;
      updated = true;
    }

    if (updated) {
      // rotate excution
      let rotationVartical = Quaternion.angleAxis(-this._xsum * this._rotateSpeed, this._initialUp);
      let rotationHorizontal = Quaternion.angleAxis(-this._ysum * this._rotateSpeed, this._initialRight);
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

  private _mouseWheel(m: MouseWheelEvent): void {

    let dir = Vector3.normalize(Vector3.subtract(this._transform.localPosition, this._origin));
    let moveDist = -m.deltaY * this._zoomSpeed;
    let distance = Vector3.subtract(this._origin, this._transform.localPosition).magnitude;
    let nextDist = Math.max(1, distance - moveDist);
    this._transform.localPosition = this._origin.addWith(dir.multiplyWith(nextDist))
    m.preventDefault();
  }
}
