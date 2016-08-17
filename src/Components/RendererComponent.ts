import CameraComponent from "./CameraComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

export default class RendererComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    camera: {
      converter: "component",
      defaultValue: "camera",
      target: "Camera"
    }
  };

  private _camera: CameraComponent;

  public $awake() {
    this.attributes.get("camera").addObserver((c) => {
      this._camera = c.Value;
    });
  }

  public $render() {
    if (this._camera) {

    }
  }
}
