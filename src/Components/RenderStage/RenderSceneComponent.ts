import GrimoireJS from "grimoirejs";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderRendererMessage from "../../Messages/IRenderRendererMessage";
import CameraComponent from "../CameraComponent";
import SingleBufferRenderStageBase from "./SingleBufferRenderStageBase";
/**
 * Render a scene specified by camera.
 */
export default class RenderSceneComponent extends SingleBufferRenderStageBase {
  public static componentName = "RenderSceneComponent";
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

  protected $awake(): void {
    super.$awake();
    this.metadata.type = "scene";
    this.getAttributeRaw("layer").bindTo("layer");
    this.getAttributeRaw("technique").bindTo("technique");
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

  protected $mount(): void {
    this._gl = this.companion.get("gl")!;
  }

  protected $renderRenderStage(args: IRenderRendererMessage): void {
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
