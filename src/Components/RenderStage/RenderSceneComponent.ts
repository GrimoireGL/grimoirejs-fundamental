import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IRenderRendererMessage from "../../Messages/IRenderRendererMessage";
import CameraComponent from "../CameraComponent";
import SingleBufferRenderStageBase from "./SingleBufferRenderStageBase";

export default class RenderSceneComponent extends SingleBufferRenderStageBase {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    layer: {
      converter: "String",
      default: "default",
    },
    camera: {
      default: null,
      converter: "Component",
      target: "Camera",
    },
    technique: {
      default: "default",
      converter: "String",
    },
  };

  public layer: string;

  public camera: CameraComponent;

  public technique: string;

  private _gl: WebGLRenderingContext;

  // messages

  public $awake(): void {
    super.$awake();
    this.getAttributeRaw("layer").boundTo("layer");
    this.getAttributeRaw("camera").boundTo("_camera");
    this.getAttributeRaw("technique").boundTo("technique");
  }

  public $mount(): void {
    this._gl = this.companion.get("gl");
  }

  public $render(args: IRenderRendererMessage): void {
    const camera = this.camera ? this.camera : args.camera;
    if (!camera) {
      return;
    }
    if (!this.__beforeRender()) {
      return;
    }
    camera.updateContainedScene(args.timer);
    camera.renderScene({
      renderer: this,
      camera,
      layer: this.layer,
      viewport: this.out.getViewport(),
      timer: args.timer,
      technique: this.technique,
      sceneDescription: {},
      rendererDescription: this.rendererDescription,
    });
  }
}
