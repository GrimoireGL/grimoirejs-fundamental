import ViewportMouseEvent from "../Objects/ViewportMouseEvent";
import gr from "grimoirejs";
import IBufferUpdatedMessage from "../Messages/IBufferUpdatedMessage";
import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "./CameraComponent";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Rectangle from "grimoirejs-math/ref/Rectangle";

export default class RendererComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    camera: {
      converter: "Component",
      default: "camera",
      target: "Camera"
    },
    viewport: {
      converter: "Viewport",
      default: "auto"
    },
    handleMouse: {
      converter: "Boolean",
      default: true
    }
  };

  public camera: CameraComponent;

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _viewportSizeGenerator: (canvas: HTMLCanvasElement) => Rectangle;

  private _viewportCache: Rectangle;

  private _buffers: { [key: string]: Texture2D } = {};

  private _bufferSizes: {
    [bufferName: string]: { width: number, height: number }
  } = {};

  private _mouseLeaveHandler: (e: MouseEvent) => void;

  private _mouseEnterHandler: (e: MouseEvent) => void;

  private _mouseMoveHandler: (e: MouseEvent) => void;

  private _wasInside: boolean = false;

  public $awake(): void {
    // initializing attributes
    this.getAttributeRaw("camera").boundTo("camera");
    this.getAttributeRaw("viewport").watch((v) => {
      this._viewportSizeGenerator = v;
      this.$resizeCanvas();
    });
    this._viewportSizeGenerator = this.getAttribute("viewport");
    // initializing mouse handlers
    this._mouseMoveHandler = (e: MouseEvent) => {
      if (this._isViewportInside(e)) {
        if (!this._wasInside) { // If the last mouse pointer was inside of canvas but not inside of viewport
          this.node.emit("mouseenter");
          this.node.broadcastMessage("mouseenter", this._toViewportMouseArgs(e));
        }
        this.node.emit("mousemove");
        this.node.broadcastMessage("mousemove", this._toViewportMouseArgs(e));
        this._wasInside = true; // Mark as last pointer was inside of viewport
      } else {
        if (this._wasInside) { // if position of last mouse pointer was inside and now the pointer is out side of viewport but inside of canvas
          this.node.emit("mouseleave");
          this.node.broadcastMessage("mouseleave", this._toViewportMouseArgs(e));
        }
        this._wasInside = false; // Mark as last pointer was not inside of viewport
      }
    };
    this._mouseEnterHandler = (e: MouseEvent) => {
      if (this._isViewportInside(e)) { // If mouse entered and inside of viewport
        this.node.emit("mouseenter");
        this.node.broadcastMessage("mouseenter", this._toViewportMouseArgs(e));
        this._wasInside = true;
      }
    };
    this._mouseLeaveHandler = (e: MouseEvent) => {
      if (this._wasInside) { // If mouse left canvas area and last mouse position was on viewport area
        this.node.emit("mouseleave");
        this.node.broadcastMessage("mouseleave", this._toViewportMouseArgs(e));
      }
      this._wasInside = false;
    };
  }

  public $mount(): void {
    this._gl = this.companion.get("gl") as WebGLRenderingContext;
    this._canvas = this.companion.get("canvasElement") as HTMLCanvasElement;
    this.getAttributeRaw("handleMouse").watch(a => {
      if (a) {
        this._enableMouseHandling();
      } else {
        this._disableMouseHandling();
      }
    }, true);
  }

  public $treeInitialized(): void {
    // This should be called after mounting all of tree nodes in children
    this.$resizeCanvas();
  }

  public $resizeCanvas(): void {
    this._viewportCache = this._viewportSizeGenerator(this._canvas);
    if (this.node.children.length === 0) {
      this.node.addChildByName("render-scene", {});
    }
    this.node.broadcastMessage("resizeBuffer", <IResizeBufferMessage>{
      width: this._viewportCache.Width,
      height: this._viewportCache.Height,
      buffers: this._buffers,
      bufferSizes: this._bufferSizes
    });
    this.node.broadcastMessage("bufferUpdated", <IBufferUpdatedMessage>{
      buffers: this._buffers,
      bufferSizes: this._bufferSizes
    });
  }

  public $renderViewport(args: { loopIndex: number }): void {
    this.node.broadcastMessage("render", <IRenderRendererMessage>{
      camera: this.camera,
      viewport: this._viewportCache,
      bufferSizes: this._bufferSizes,
      buffers: this._buffers,
      loopIndex: args.loopIndex
    });
  }

  private _enableMouseHandling(): void {
    this._canvas.addEventListener("mousemove", this._mouseMoveHandler);
    this._canvas.addEventListener("mouseleave", this._mouseLeaveHandler);
    this._canvas.addEventListener("mouseenter", this._mouseEnterHandler);
  }

  private _disableMouseHandling(): void {
    this._canvas.removeEventListener("mousemove", this._mouseMoveHandler);
    this._canvas.removeEventListener("mouseleave", this._mouseLeaveHandler);
    this._canvas.removeEventListener("mouseenter", this._mouseEnterHandler);
  }

  /**
   * Check mouse is inside of viewport
   * @param  {MouseEvent} e [description]
   * @return {boolean}      [description]
   */
  private _isViewportInside(e: MouseEvent): boolean {
    const rc = this._getRelativePosition(e);
    const n = this._viewportCache.toLocalNormalized(rc[0], rc[1]);
    return n[0] >= 0 && n[0] <= 1 && n[1] >= 0 && n[1] <= 1;
  }

  /**
   * Obtain mouse point of relative coordinate from element.
   * @param  {MouseEvent} e [description]
   * @return {number[]}     [description]
   */
  private _getRelativePosition(e: MouseEvent): number[] {
    const rect = this._canvas.getBoundingClientRect();
    const positionX = rect.left + window.pageXOffset;
    const positionY = rect.top + window.pageYOffset;
    return [e.pageX - positionX, e.pageY - positionY];
  }

  /**
   * Convert mouse args into viewport mouse event
   * @param  {MouseEvent}         e [description]
   * @return {ViewportMouseEvent}   [description]
   */
  private _toViewportMouseArgs(e: MouseEvent): ViewportMouseEvent {
    const ro = this._getRelativePosition(e);
    const r = this._viewportCache.toLocal(ro[0], ro[1]);
    const n = this._viewportCache.toLocalNormalized(ro[0], ro[1]);
    return Object.assign(e, {
      viewportX: r[0],
      viewportY: r[1],
      viewportNormalizedX: n[0],
      viewportNormalizedY: n[1]
    });
  }
}
