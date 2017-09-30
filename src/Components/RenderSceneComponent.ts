import gr from "grimoirejs";
import ResourceBase from "../Resource/ResourceBase";
import AssetLoader from "../Asset/AssetLoader";
import Material from "../Material/Material";
import Color4 from "grimoirejs-math/ref/Color4";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import Framebuffer from "../Resource/FrameBuffer";
import IBufferUpdatedMessage from "../Messages/IBufferUpdatedMessage";
import CameraComponent from "./CameraComponent";
import Viewport from "../Resource/Viewport";
import IRenderingTarget from "../Resource/RenderingTarget/IRenderingTarget";
export default class RenderSceneComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    layer: {
      converter: "String",
      default: "default"
    },
    depthBuffer: {
      default: null,
      converter: "String"
    },
    out: {
      converter: "RenderingTarget",
      default: "default"
    },
    clearColor: {
      default: "#0000",
      converter: "Color4",
    },
    clearColorEnabled: {
      default: true,
      converter: "Boolean",
    },
    clearDepthEnabled: {
      default: true,
      converter: "Boolean",
    },
    clearDepth: {
      default: 1.0,
      converter: "Number",
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

  public clearColor: Color4;

  public clearColorEnabled: boolean;

  public clearDepthEnabled: boolean;

  public clearDepth: number;

  public camera: CameraComponent;

  public technique: string;

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _fbo: Framebuffer;

  private _fboViewport: Viewport;

  public out: IRenderingTarget;

  // messages

  public $awake(): void {
    this.getAttributeRaw("layer").boundTo("layer");
    this.getAttributeRaw("clearColor").boundTo("clearColor");
    this.getAttributeRaw("clearColorEnabled").boundTo("clearColorEnabled");
    this.getAttributeRaw("clearDepthEnabled").boundTo("clearDepthEnabled");
    this.getAttributeRaw("clearDepth").boundTo("clearDepth");
    this.getAttributeRaw("camera").boundTo("_camera");
    this.getAttributeRaw("technique").boundTo("technique");
    this.getAttributeRaw("out").boundTo("out");
  }


  public $mount(): void {
    this._gl = this.companion.get("gl");
    this._canvas = this.companion.get("canvasElement");
  }

  public $bufferUpdated(args: IBufferUpdatedMessage): void {
    const out = this.getAttribute("out");
    if (out !== "default") {
      this._fbo = new Framebuffer(this.companion.get("gl"));
      this._fbo.update(args.buffers[out]);
      this._fboViewport = args.bufferViewports[out];
    }
    const depthBuffer = this.getAttribute("depthBuffer");
    if (depthBuffer && this._fbo) {
      this._fbo.update(args.buffers[depthBuffer]);
    }
  }

  public $render(args: IRenderRendererMessage): void {
    const camera = this.camera ? this.camera : args.camera;
    if (!camera) {
      return;
    }
    let clearFlag = 0;
    if(this._fbo && this.clearColorEnabled){
      clearFlag |= WebGLRenderingContext.COLOR_BUFFER_BIT;
    }
    if(this.clearDepthEnabled){
      clearFlag |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
    }
    this.out.beforeDraw(clearFlag,this.clearColor.rawElements as number[],this.clearDepth);
    camera.updateContainedScene(args.timer);
    camera.renderScene({
      renderer: this,
      camera: camera,
      buffers: args.buffers,
      layer: this.layer,
      viewport: this.out.getViewport(),
      timer: args.timer,
      technique: this.technique,
      sceneDescription: {}
    });
  }
}
