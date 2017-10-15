import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderRendererMessage from "../../Messages/IRenderRendererMessage";
import CameraComponent from "../CameraComponent";
import SingleBufferRenderStageBase from "./SingleBufferRenderStageBase";

/**
 * no document
 */
export default class RenderSceneComponent extends SingleBufferRenderStageBase {
  public static componentName = "RenderScene";
  /**
   * no document
   */
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

  /**
   * no document
   */
  public layer: string;

  /**
   * no document
   */
  public camera: CameraComponent;

  /**
   * no document
   */
  public technique: string;

  private _gl: WebGLRenderingContext;

  // messages

  protected $awake(): void {
    super.$awake();
    this.getAttributeRaw("layer").bindTo("layer");
    this.getAttributeRaw("camera").bindTo("_camera");
    this.getAttributeRaw("technique").bindTo("technique");
  }

  protected $mount(): void {
    this._gl = this.companion.get("gl");
  }

  protected $render(args: IRenderRendererMessage): void {
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
