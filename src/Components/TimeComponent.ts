import SceneComponent from "./SceneComponent";
import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Quaternion from "grimoirejs-math/ref/Quaternion";
import Matrix from "grimoirejs-math/ref/Matrix";
import TransformComponent from "./TransformComponent";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

export default class TimeComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    time: {
      default: 0,
      converter: "Number"
    },
    timeDelta: {
      default: 0,
      converter: "Number"
    }
  };

  private _time = 0;
  private _startTime = 0;
  private _lastFrame = 0;

  public $awake(): void {
    this._time = 0;
    this._lastFrame = 0;
    this._startTime = Date.now();
  }

  public $update() {
    const now = Date.now();
    const total = now - this._startTime;

    this.setAttribute("time", now);
    this.setAttribute("timeDelta", now - this._lastFrame);

    this._lastFrame = now;
  }
}
