import gr from "grimoirejs";
import RenderSceneArgument from "../Objects/RenderSceneArgument";
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
      converter: "String",
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

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _fbo: Framebuffer;

  private _fboSize: { width: number, height: number };

  // backing fields

  private _layer: string;

  private _clearColor: Color4;

  private _clearColorEnabled: boolean;

  private _clearDepthEnabled: boolean;

  private _clearDepth: number;

  public camera: CameraComponent;

  private _technique: string;

  // messages

  public $awake(): void {
    this.getAttributeRaw("layer").boundTo("_layer");
    this.getAttributeRaw("clearColor").boundTo("_clearColor");
    this.getAttributeRaw("clearColorEnabled").boundTo("_clearColorEnabled");
    this.getAttributeRaw("clearDepthEnabled").boundTo("_clearDepthEnabled");
    this.getAttributeRaw("clearDepth").boundTo("_clearDepth");
    this.getAttributeRaw("camera").boundTo("camera");
    this.getAttributeRaw("technique").boundTo("_technique");
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
      this._fboSize = args.bufferSizes[out];
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
    if (this._fbo) {
      this._fbo.bind();
      this._gl.viewport(0, 0, this._fboSize.width, this._fboSize.height);
    } else {
      this._gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
      this._gl.viewport(args.viewport.Left, this._canvas.height - args.viewport.Bottom, args.viewport.Width, args.viewport.Height);
    }
    // clear buffer if needed
    if (this._fbo && this._clearColorEnabled) {
      this._gl.clearColor(this._clearColor.R, this._clearColor.G, this._clearColor.B, this._clearColor.A);
      this._gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
    }
    if (this._clearDepthEnabled) {
      this._gl.clearDepth(this._clearDepth);
      this._gl.clear(WebGLRenderingContext.DEPTH_BUFFER_BIT);
    }
    args.camera.updateContainedScene(args.loopIndex);
    args.camera.renderScene({
      renderer:this,
      camera: camera,
      buffers: args.buffers,
      layer: this._layer,
      viewport: args.viewport,
      loopIndex: args.loopIndex,
      technique: this._technique
    });
  }
}
