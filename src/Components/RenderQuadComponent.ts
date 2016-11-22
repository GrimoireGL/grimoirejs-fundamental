import gr from "grimoirejs";
import MaterialContainerComponent from "./MaterialContainerComponent";
import GeometryRegistoryComponent from "./GeometryRegistoryComponent";
import Geometry from "../Geometry/Geometry";
import IMaterialArgument from "../Material/IMaterialArgument";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import IBufferUpdatedMessage from "../Messages/IBufferUpdatedMessage";
import Framebuffer from "../Resource/FrameBuffer";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Color4 from "grimoirejs-math/ref/Color4";

export default class RenderQuadComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    out: {
      defaultValue: "default",
      converter: "String"
    },
    depthBuffer: {
      defaultValue: undefined,
      converter: "String"
    },
    targetBuffer: {
      defaultValue: "default",
      converter: "String",
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
    }
  };

  private _targetBuffer: string;

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _fbo: Framebuffer;

  private _fboSize: { width: number, height: number; };

  private _geom: Geometry;

  private _clearColor: Color4;

  private _clearColorEnabled: boolean;

  private _clearDepth: number;

  private _clearDepthEnabled: boolean;

  private _materialContainer: MaterialContainerComponent;

  public $awake(): void {
    this.getAttribute("targetBuffer").boundTo("_targetBuffer");
    this.getAttribute("clearColor").boundTo("_clearColor");
    this.getAttribute("clearColorEnabled").boundTo("_clearColorEnabled");
    this.getAttribute("clearDepthEnabled").boundTo("_clearDepthEnabled");
    this.getAttribute("clearDepth").boundTo("_clearDepth");
  }

  public $mount(): void {
    this._gl = this.companion.get("gl");
    this._canvas = this.companion.get("canvasElement");
    const gr = this.companion.get("GeometryRegistory") as GeometryRegistoryComponent;
    this._geom = gr.getGeometry("quad");
    this._materialContainer = this.node.getComponent("MaterialContainer") as MaterialContainerComponent;
  }

  public $bufferUpdated(args: IBufferUpdatedMessage): void {
    const out = this.getValue("out");
    if (out !== "default") {
      this._fbo = new Framebuffer(this.companion.get("gl"));
      this._fbo.update(args.buffers[out]);
      this._fboSize = args.bufferSizes[out];
    }
    const depthBuffer = this.getValue("depthBuffer");
    if (depthBuffer && this._fbo) {
      this._fbo.update(args.buffers[depthBuffer]);
    }
  }

  public $render(args: IRenderRendererMessage): void {
    if (!this._materialContainer.ready) {
      return;
    }
    // bound render target
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
    // make rendering argument
    const renderArgs = <IMaterialArgument>{
      targetBuffer: this._targetBuffer,
      geometry: this._geom,
      attributeValues: {},
      camera: null,
      transform: null,
      buffers: args.buffers,
      viewport: args.viewport,
      defaultTexture: this.companion.get("defaultTexture")
    };
    renderArgs.attributeValues = this._materialContainer.materialArgs;
    // do render
    this._materialContainer.material.draw(renderArgs);
    this._gl.flush();
  }
}
