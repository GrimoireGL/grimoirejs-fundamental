import gr from "grimoirejs";
import ResourceBase from "../../Resource/ResourceBase";
import AssetLoader from "../../Asset/AssetLoader";
import Material from "../../Material/Material";
import Color4 from "grimoirejs-math/ref/Color4";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IRenderRendererMessage from "../../Messages/IRenderRendererMessage";
import Framebuffer from "../../Resource/FrameBuffer";
import CameraComponent from "../CameraComponent";
import Viewport from "../../Resource/Viewport";
import IRenderingTarget from "../../Resource/RenderingTarget/IRenderingTarget";
import SingleBufferRenderStageBase from "./SingleBufferRenderStageBase";

export default class RenderSceneComponent extends SingleBufferRenderStageBase {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    layer: {
      converter: "String",
      default: "default"
    },
    camera: {
      default: null,
      converter: "Component",
      target: "Camera"
    },
    technique: {
      default: "default",
      converter: "String"
    }
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
    this.__beforeRender();
    camera.updateContainedScene(args.timer);
    camera.renderScene({
      renderer: this,
      camera: camera,
      layer: this.layer,
      viewport: this.out.getViewport(),
      timer: args.timer,
      technique: this.technique,
      sceneDescription: {},
      rendererDescription: this.rendererDescription
    });
  }
}
