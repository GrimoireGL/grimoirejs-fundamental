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
    const gl: WebGLRenderingContext = this.sharedObject.get("gl");
    gl.drawElements(WebGLRenderingContext.TRIANGLES, 3, WebGLRenderingContext.UNSIGNED_BYTE, 0);
    gl.flush();
  }
}
