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
        }

    };

    private transform: TransformComponent;

    private scriptTag: HTMLScriptElement;

    private lastScreenPos: { x: number, y: number } = { x: NaN, y: NaN };

    private _rotateX: number;

    private _rotateY: number;

    private _moveZ: number;

    private _origin: Vector3 = new Vector3(0, 0, 0);
    public $awake(): void {
        this.transform = this.node.getComponent("Transform") as TransformComponent;
        this.scriptTag = this.companion.get("canvasElement");
    }

    public $mount(): void {
        this.scriptTag.addEventListener("mousemove", this._mouseMove.bind(this));
        this.scriptTag.addEventListener("mousewheel", this._mouseWheel.bind(this));
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
            const rotation = Quaternion.euler(0.01 * diffY, 0.01 * diffX, 0);
            let direction = this.transform.position.subtractWith(this._origin);
            const rotationMat = Matrix.rotationQuaternion(rotation);
            direction = Matrix.transformNormal(rotationMat, direction);
            this.transform.position = this._origin.addWith(direction);
            this.transform.rotation =Quaternion.multiply(
              this.transform.rotation,
              rotation.inverse()
            )
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
