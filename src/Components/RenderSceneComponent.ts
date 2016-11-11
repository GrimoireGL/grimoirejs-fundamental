import gr from "grimoirejs";
import RenderSceneArgument from "../Objects/RenderSceneArgument";
import ResourceBase from "../Resource/ResourceBase";
import SORTPass from "../Material/SORTPass";
import AssetLoader from "../Asset/AssetLoader";
import Material from "../Material/Material";
import {Color4} from "grimoirejs-math";
const Component = gr.Node.Component;
const IAttributeDeclaration = gr.Node.IAttributeDeclaration;
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import Framebuffer from "../Resource/FrameBuffer";
import IBufferUpdatedMessage from "../Messages/IBufferUpdatedMessage";
import CameraComponent from "./CameraComponent";
import MaterialContainerComponent from "./MaterialContainerComponent";
export default class RenderSceneComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    layer: {
      converter: "String",
      defaultValue: "default"
    },
    depthBuffer: {
      defaultValue: undefined,
      converter: "String"
    },
    out: {
      converter: "String",
      defaultValue: "default"
    },
    clearColor: {
      defaultValue: "#0000",
      converter: "Color4",
    },
    clearColorEnabled: {
      defaultValue: true,
      converter: "Boolean",
    },
    clearDepthEnabled: {
      defaultValue: true,
      converter: "Boolean",
    },
    clearDepth: {
      defaultValue: 1.0,
      converter: "Number",
    },
    camera: {
      defaultValue: undefined,
      converter: "Component",
      target: "Camera"
    }
  };

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _materialContainer: MaterialContainerComponent;

  private _fbo: Framebuffer;

  // backing fields

  private _layer: string;

  private _clearColor: Color4;

  private _clearColorEnabled: boolean;

  private _clearDepthEnabled: boolean;

  private _clearDepth: number;

  private _camera: CameraComponent;

  // messages

  public $awake(): void {
    this.getAttribute("layer").boundTo("_layer");
    this.getAttribute("clearColor").boundTo("_clearColor");
    this.getAttribute("clearColorEnabled").boundTo("_clearColorEnabled");
    this.getAttribute("clearDepthEnabled").boundTo("_clearDepthEnabled");
    this.getAttribute("clearDepth").boundTo("_clearDepth");
    this.getAttribute("camera").boundTo("_camera");
  }


  public $mount(): void {
    this._gl = this.companion.get("gl");
    this._canvas = this.companion.get("canvasElement");
    this._materialContainer = this.node.getComponent("MaterialContainer") as MaterialContainerComponent;
  }

  public $bufferUpdated(args: IBufferUpdatedMessage): void {
    const out = this.getValue("out");
    if (out !== "default") {
      this._fbo = new Framebuffer(this.companion.get("gl"));
      this._fbo.update(args.buffers[out]);
    }
    const depthBuffer = this.getValue("depthBuffer");
    if (depthBuffer && this._fbo) {
      this._fbo.update(args.buffers[depthBuffer]);
    }
  }

  public $render(args: IRenderRendererMessage): void {
    const camera = this._camera ? this._camera : args.camera;
    if (!camera) {
      return;
    }
    if (this._fbo) {
      this._fbo.bind();
      this._gl.viewport(0, 0, args.viewport.Width, args.viewport.Height);
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
    const useMaterial = this._materialContainer.useMaterial;
    args.camera.renderScene(<RenderSceneArgument>{
      caller: this,
      camera: camera,
      buffers: args.buffers,
      layer: this._layer,
      viewport: args.viewport,
      material: useMaterial ? this._materialContainer.material : undefined,
      materialArgs: useMaterial ? this._materialContainer.material : undefined,
      loopIndex: args.loopIndex
    });
  }
}
