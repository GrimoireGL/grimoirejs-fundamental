import GrimoireJS from "grimoirejs";
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
      default: "camera",
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
    this.metadata.type = "scene";
    this.getAttributeRaw("layer").boundTo("layer");
    this.getAttributeRaw("technique").boundTo("technique");
    this.getAttributeRaw("camera").watch((cam: CameraComponent) => {
      this.metadata.camera = cam ? cam.node.id : null;
      this.camera = cam;
    }, true);
    this.getAttributeRaw("technique").watch((t: string) => {
      this.metadata.technique = t;
    }, true);
    this.getAttributeRaw("layer").watch((t: string) => {
      this.metadata.layer = t;
    }, true);
  }

  public $mount(): void {
    this._gl = this.companion.get("gl");
  }

  public $renderRenderStage(args: IRenderRendererMessage): void {
    if (!this.camera) {
      return;
    }
    if (!this.__beforeRender()) {
      return;
    }
    this.camera.updateContainedScene(args.timer);
    this.camera.renderScene({
      renderer: this,
      camera: this.camera,
      layer: this.layer,
      viewport: this.out.getViewport(),
      timer: args.timer,
      technique: this.technique,
      sceneDescription: {},
      rendererDescription: this.rendererDescription,
    });
  }
}
