import MaterialContainerComponent from "./MaterialContainerComponent";
import GeometryRegistoryComponent from "./GeometryRegistoryComponent";
import Geometry from "../Geometry/Geometry";
import IMaterialArgument from "../Material/IMaterialArgument";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import IBufferUpdatedMessage from "../Messages/IBufferUpdatedMessage";
import Framebuffer from "../Resource/FrameBuffer";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import {Color4} from "grimoirejs-math";

export default class RenderQuadComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    out: {
      defaultValue: "default",
      converter: "string"
    },
    targetBuffer: {
      defaultValue: "default",
      converter: "string",
      boundTo: "_targetBuffer"
    },
    clearColor: {
      defaultValue: "#0000",
      converter: "color4",
      boundTo: "_clearColor"
    },
    clearColorEnabled: {
      defaultValue: true,
      converter: "boolean",
      boundTo: "_clearColorEnabled"
    }
  };

  private _targetBuffer: string;

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _fbo: Framebuffer;

  private _geom: Geometry;

  private _clearColor: Color4;

  private _clearColorEnabled: boolean;

  private _materialContainer: MaterialContainerComponent;

  public $mount() {
    this._gl = this.companion.get("gl");
    this._canvas = this.companion.get("canvasElement");
    const gr = this.companion.get("GeometryRegistory") as GeometryRegistoryComponent;
    this._geom = gr.getGeometry("quad");
    this._materialContainer = this.node.getComponent("MaterialContainer") as MaterialContainerComponent;
  }

  public $bufferUpdated(args: IBufferUpdatedMessage) {
    const out = this.getValue("out");
    if (out !== "default") {
      this._fbo = new Framebuffer(this.companion.get("gl"));
      this._fbo.update(args.buffers[out]);
    }
  }

  public $render(args: IRenderRendererMessage) {
    if (!this._materialContainer.ready) {
      return;
    }
    // bound render target
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
    // make rendering argument
    const renderArgs = <IMaterialArgument>{
      targetBuffer: this._targetBuffer,
      geometry: this._geom,
      attributeValues: {},
      camera: args.camera.camera,
      transform: null,
      buffers: args.buffers,
      viewport: args.viewport
    };
    renderArgs.attributeValues = this._materialContainer.materialArgs;
    // do render
    this._materialContainer.material.draw(renderArgs);
    this._gl.flush();
  }
}
