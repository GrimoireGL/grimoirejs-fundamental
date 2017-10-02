import RendererComponent from "./RendererComponent";
import IRenderable from "../SceneRenderer/IRenderable";
import MeshIndexCalculator from "../Util/MeshIndexCalculator";
import ViewportMouseEvent from "../Objects/ViewportMouseEvent";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import Framebuffer from "../Resource/FrameBuffer";
import Texture2D from "../Resource/Texture2D";
import RenderBuffer from "../Resource/RenderBuffer";
import TextureSizeCalculator from "../Util/TextureSizeCalculator";
import IResizeViewportMessage from "../Messages/IResizeViewportMessage";
import RenderSceneComponent from "./RenderStage/RenderSceneComponent";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Component from "grimoirejs/ref/Node/Component";
import Viewport from "../Resource/Viewport";
import CameraComponent from "./CameraComponent";
export default class RenderHitareaComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {

  };

  private _sceneRenderer: RenderSceneComponent;

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _lastPosition: number[];

  private _mouseInside: boolean;

  private _readCache: Uint8Array = new Uint8Array(4);

  private _bufferViewport: Viewport;

  private _lastRenderable: IRenderable;

  private _mouseMoved: boolean;

  public hitareaTexture: Texture2D;

  public hitareaRenderbuffer: RenderBuffer;

  public hitareaFBO: Framebuffer;

  public $mount(): void {
    this._sceneRenderer = this.node.getComponent(RenderSceneComponent);
    if (!this._sceneRenderer) {
      throw new Error("The node attaching RenderHitArea should contain RenderScene.");
    }
    this._gl = this.companion.get("gl");
    this._canvas = this.companion.get("canvasElement");
    this.hitareaTexture = new Texture2D(this._gl);
    this.hitareaRenderbuffer = new RenderBuffer(this._gl);
    if (this.hitareaFBO) {
      this.hitareaFBO.destroy();
      this.hitareaFBO = null;
    }
  }

  public $resizeViewport(args: IResizeViewportMessage): void {
    const size = TextureSizeCalculator.getPow2Size(args.width, args.height);
    this._bufferViewport = new Viewport(0, 0, size.width, size.height);
    this.hitareaTexture.update(0, size.width, size.height, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE);
    this.hitareaRenderbuffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, size.width, size.height);
    if (!this.hitareaFBO) {
      this.hitareaFBO = new Framebuffer(this._gl);
      this.hitareaFBO.update(this.hitareaTexture);
      this.hitareaFBO.update(this.hitareaRenderbuffer);
    }
  }

  public $render(args: IRenderRendererMessage): void {
    if (!this._mouseInside) {
      return;
    }
    const camera = this._sceneRenderer.camera || args.camera;
    if (!camera) {
      return;
    }
    this.hitareaFBO.bind();
    this._bufferViewport.configure(this._gl);
    // clear buffer if needed
    this._gl.clearColor(0, 0, 0, 0);
    this._gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
    this._gl.clearDepth(1);
    this._gl.clear(WebGLRenderingContext.DEPTH_BUFFER_BIT);
    // draw for mesh indices
    camera.renderScene({
      renderer: this._sceneRenderer, // TODO
      camera: camera,
      layer: this._sceneRenderer.layer,
      viewport: args.viewport,
      timer: args.timer,
      technique: "hitarea",
      sceneDescription: {},
      sortingTechnique: "default"
    });
    this._gl.flush();
    // pick pointer pixel
    this._gl.readPixels(this._lastPosition[0] * this._bufferViewport.Width, this._lastPosition[1] * this._bufferViewport.Height, 1, 1, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, this._readCache);
    this._updateCurrentIndex(MeshIndexCalculator.fromColor(this._readCache), camera);
    // reset bound frame buffer
    this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
  }

  public $mousemove(v: ViewportMouseEvent): void {
    this._lastPosition = [v.viewportNormalizedX, 1.0 - v.viewportNormalizedY];
    this._mouseMoved = true;
  }

  public $mouseenter(v: ViewportMouseEvent): void {
    this._mouseInside = true;
    this._lastPosition = [v.viewportNormalizedX, 1.0 - v.viewportNormalizedY];
    this._mouseMoved = true;
  }

  public $mouseleave(v: ViewportMouseEvent): void {
    this._mouseInside = false;
    this._lastPosition = [v.viewportNormalizedX, 1.0 - v.viewportNormalizedY];
    this._mouseMoved = true;
    if (this._lastRenderable instanceof Component) {
      this._lastRenderable.node.emit("mouseleave", this._lastRenderable);
    }
    this._lastRenderable = null;
  }

  /**
   * Update current mesh index. Emit events if need.
   * @param index
   * @param camera
   */
  private _updateCurrentIndex(index: number, camera: CameraComponent): void{
    if (index === 0) { // there was no object at pointer
      if (this._lastRenderable instanceof Component) {
        this._lastRenderable.node.emit("mouseleave", this._lastRenderable);
      }
      this._lastRenderable = null;
    } else {
      const r = camera.containedScene.queueRegistory.getByIndex(index - 1);
      if (this._lastRenderable !== r) {
        if (this._lastRenderable instanceof Component) {
          this._lastRenderable.node.emit("mouseleave", this._lastRenderable);
        }
        if (r instanceof Component) {
          r.node.emit("mouseenter", r);
        }
      } else {
        if (r instanceof Component) {
          if (this._mouseMoved) {
            r.node.emit("mousemove", r);
          } else {
            r.node.emit("mouseon", r);
          }
        }
      }
      this._lastRenderable = r;
    }
  }
}
