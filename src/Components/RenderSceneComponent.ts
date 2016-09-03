import {Color4} from "grimoirejs-math";
import IRenderSceneMessage from "../Messages/IRenderSceneMessage";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import Framebuffer from "../Resource/FrameBuffer";
import IBufferUpdatedMessage from "../Messages/IBufferUpdatedMessage";
export default class RenderSceneComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    layer: {
      converter: "string",
      defaultValue: "default",
      boundTo: "_layer"
    },
    out: {
      converter: "string",
      defaultValue: "default"
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

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _fbo: Framebuffer;

  private _layer: string;


  private _clearColor: Color4;

  private _clearColorEnabled: boolean;

  public $mount() {
    this._gl = this.companion.get("gl");
    this._canvas = this.companion.get("canvasElement");
  }

  public $bufferUpdated(args: IBufferUpdatedMessage) {
    const out = this.getValue("out");
    if (out !== "default") {
      this._fbo = new Framebuffer(this.companion.get("gl"));
      this._fbo.update(args.buffers[out]);
    }
  }

  public $render(args: IRenderRendererMessage) {
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
    args.camera.node.sendMessage("renderScene", <IRenderSceneMessage>{
      camera: args.camera,
      buffers: args.buffers,
      layer: this._layer
    });
  }
}
