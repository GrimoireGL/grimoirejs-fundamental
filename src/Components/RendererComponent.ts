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

  public $treeInitialized() {
    // TODO camera should be obtained by attribute
    this._camera = this.tree("camera")("Camera").get() as CameraComponent;
  }

  public $renderScene() {
    if (this._camera) {
      this._camera.node.sendMessage("renderScene", this);
    }
  }
}