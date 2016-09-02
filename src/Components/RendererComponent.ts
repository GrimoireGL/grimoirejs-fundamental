import CameraComponent from "./CameraComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import {Rectangle} from "grimoirejs-math";

export default class RendererComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    camera: {
      converter: "component",
      defaultValue: "camera",
      target: "Camera",
      boundTo: "_camera"
    },
    viewport: {
      converter: "viewport",
      defaultValue: "auto"
    }
  };

  private _camera: CameraComponent;

  private _gl: WebGLRenderingContext;

  private _viewport: Rectangle;

  public $mount() {
    this._gl = this.companion.get("gl") as WebGLRenderingContext;
    this._viewport = this.getValue("viewport");
    this.attributes.get("viewport").addObserver((v) => this._viewport = v.Value);
  }

  public $renderScene() {
    if (this._camera) {
      this._gl.viewport(this._viewport.Left, this._viewport.Height - this._viewport.Top, this._viewport.Width, this._viewport.Height);
      this._camera.node.sendMessage("renderScene", this);
    }
  }
}
