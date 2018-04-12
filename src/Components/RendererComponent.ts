import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import IResizeViewportMessage from "../Messages/IResizeViewportMessage";
import ViewportMouseEvent from "../Objects/ViewportMouseEvent";
import CanvasRegionRenderingTarget from "../Resource/RenderingTarget/CanvasRegionRenderingTarget";
import RenderingTargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";
import Viewport from "../Resource/Viewport";
import TextureSizeCalculator from "../Util/TextureSizeCalculator";
import Timer from "../Util/Timer";
import CameraComponent from "./CameraComponent";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import { ViewportConverter } from "../Converters/ViewportConverter";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { companion, attribute, overrideGetter, watch } from "grimoirejs/ref/Core/Decorator";

type ViewportSizeGenerator = (canvas: HTMLCanvasElement) => Viewport;

function _generatorToSize(this: RendererComponent, generator: ViewportSizeGenerator): Viewport {
  return generator(this["_canvas"]);
}

export default class RendererComponent extends Component {
  public static componentName = "Renderer";

  @attribute(StringConverter, null)
  public regionName!: string;

  @overrideGetter(_generatorToSize as any)
  @attribute(ViewportConverter, "auto")
  public viewport!: Viewport;

  @attribute(BooleanConverter, true)
  public handleMouse!: boolean;

  public renderingTarget: Promise<CanvasRegionRenderingTarget> = new Promise<CanvasRegionRenderingTarget>((resolve) => {
    this._renderingTargetResolver = resolve;
  });

  private _renderingTargetResolver!: (rt: CanvasRegionRenderingTarget) => void;

  private _renderingTarget!: CanvasRegionRenderingTarget;

  // public get viewport(): Viewport {
  //   if (this._viewportCache) {
  //     return this._viewportCache;
  //   } else {
  //     this._viewportCache = this._viewportSizeGenerator((this.companion.get("gl") as WebGLRenderingContext).canvas);
  //     return this._viewportCache;
  //   }
  // }
  @companion("gl")
  private _gl!: WebGLRenderingContext;

  @companion("canvasElement")
  private _canvas!: HTMLCanvasElement;

  private _mouseLeaveHandler!: (e: MouseEvent) => void;

  private _mouseEnterHandler!: (e: MouseEvent) => void;

  private _mouseMoveHandler!: (e: MouseEvent) => void;

  private _mouseDownHandler!: (e: MouseEvent) => void;

  private _mouseUpHandler!: (e: MouseEvent) => void;

  private _mouseClickHandler!: (e: MouseEvent) => void;

  private _dblClickHandler!: (e: MouseEvent) => void;

  private _wasInside = false;

  protected $awake(): void {
    // viewport converter returns a delegate to generate viewport size
    let regionName = this.getAttribute("regionName");
    if (!regionName) {
      regionName = "renderer-" + this.node.index;
    }
    const gl = this.companion.get("gl");
    const rt = new CanvasRegionRenderingTarget(gl);
    this._renderingTarget = rt;
    rt.setViewport(this.viewport);
    RenderingTargetRegistry.get(gl).setRenderingTarget(regionName, rt);
    this._renderingTargetResolver(rt);
    this._initializeMouseHandlers();
  }

  protected $mount(): void {
    if (this.node.children.length === 0) { // complement render stage
      this.node.addChildByName("render-scene", {});
    }
    this.$resizeCanvas();
  }

  protected $unmount(): void {
    this._disableMouseHandling();
  }

  protected $treeInitialized(): void {
    // This should be called after mounting all of tree nodes in children
    this.$resizeCanvas();
  }

  protected $resizeCanvas(): void {
    const vp = this.viewport;
    this._renderingTarget.setViewport(vp);
    const pow2Size = TextureSizeCalculator.getPow2Size(vp.Width, vp.Height);
    this.node.broadcastMessage("resizeViewport", {
      width: vp.Width,
      height: vp.Height,
      pow2Width: pow2Size.width,
      pow2Height: pow2Size.height,
    } as IResizeViewportMessage);
  }

  protected $renderRenderer(args: { timer: Timer }): void {
    this.node.broadcastMessage("renderRenderStage", {
      timer: args.timer,
    } as IRenderRendererMessage);
  }

  private _initializeMouseHandlers() {
    // initializing mouse handlers
    this._mouseMoveHandler = (e: MouseEvent) => {
      if (this._isViewportInside(e)) {
        if (!this._wasInside) { // If the last mouse pointer was inside of canvas but not inside of viewport
          this._sendMouseEvent("mouseenter", e);
        }
        this._sendMouseEvent("mousemove", e);
        this._wasInside = true; // Mark as last pointer was inside of viewport
      } else {
        if (this._wasInside) { // if position of last mouse pointer was inside and now the pointer is out side of viewport but inside of canvas
          this._sendMouseEvent("mouseleave", e);
        }
        this._wasInside = false; // Mark as last pointer was not inside of viewport
      }
    };
    this._mouseEnterHandler = (e: MouseEvent) => {
      if (this._isViewportInside(e)) { // If mouse entered and inside of viewport
        this._sendMouseEvent("mouseenter", e);
        this._wasInside = true;
      }
    };
    this._mouseLeaveHandler = (e: MouseEvent) => {
      if (this._wasInside) { // If mouse left canvas area and last mouse position was on viewport area
        this._sendMouseEvent("mouseleave", e);
      }
      this._wasInside = false;
    };
    this._mouseClickHandler = (e: MouseEvent) => {
      this._sendMouseEvent("click", e);
    };
    this._dblClickHandler = (e: MouseEvent) => {
      this._sendMouseEvent("dblclick", e);
    };
    this._mouseDownHandler = (e: MouseEvent) => {
      if (this._isViewportInside(e)) {
        this._sendMouseEvent("mousedown", e);
        this._wasInside = true;
      }
    };
    // Mouse up can be called even if mouse pointer was not inside of viewport
    this._mouseUpHandler = (e: MouseEvent) => {
      this._sendMouseEvent("mouseup", e);
    };
  }

  private _enableMouseHandling(): void {
    this._canvas.addEventListener("mousemove", this._mouseMoveHandler);
    this._canvas.addEventListener("mouseleave", this._mouseLeaveHandler);
    this._canvas.addEventListener("mouseenter", this._mouseEnterHandler);
    this._canvas.addEventListener("mousedown", this._mouseDownHandler);
    this._canvas.addEventListener("mouseup", this._mouseUpHandler);
    this._canvas.addEventListener("click", this._mouseClickHandler);
    this._canvas.addEventListener("dblclick", this._dblClickHandler);
  }

  private _disableMouseHandling(): void {
    this._canvas.removeEventListener("mousemove", this._mouseMoveHandler);
    this._canvas.removeEventListener("mouseleave", this._mouseLeaveHandler);
    this._canvas.removeEventListener("mouseenter", this._mouseEnterHandler);
    this._canvas.removeEventListener("mousedown", this._mouseDownHandler);
    this._canvas.removeEventListener("mouseup", this._mouseUpHandler);
    this._canvas.removeEventListener("click", this._mouseClickHandler);
    this._canvas.removeEventListener("dblclick", this._dblClickHandler);
  }

  private _sendMouseEvent(eventName: string, e: MouseEvent): void {
    if (!this.isActive) {
      return;
    }
    this.node.emit(eventName, e);
    this.node.broadcastMessage(eventName, this._toViewportMouseArgs(e));
  }
  @watch("handleMouse")
  private _onMouseHandleChanged(enabled: boolean): void {
    if (enabled) {
      this._enableMouseHandling();
    } else {
      this._disableMouseHandling();
    }
  }

  @watch("viewport")
  private _onViewportChanged(): void {
    this.$resizeCanvas();
  }

  /**
   * Check mouse is inside of viewport
   * @param  {MouseEvent} e [description]
   * @return {boolean}      [description]
   */
  private _isViewportInside(e: MouseEvent): boolean {
    const rc = this._getRelativePosition(e);
    const n = this.viewport.toLocalNormalized(rc[0], rc[1]);
    return n[0] >= 0 && n[0] <= 1 && n[1] >= 0 && n[1] <= 1;
  }

  /**
   * Obtain mouse point of relative coordinate from element.
   * @param  {MouseEvent} e [description]
   * @return {number[]}     [description] x,y,width,height
   */
  private _getRelativePosition(e: MouseEvent): number[] {
    const rect = this._canvas.getBoundingClientRect();
    const positionX = rect.left + window.pageXOffset;
    const positionY = rect.top + window.pageYOffset;
    return [e.pageX - positionX, rect.height - (e.pageY - positionY), rect.width, rect.height];
  }

  /**
   * Convert mouse args into viewport mouse event
   * @param  {MouseEvent}         e [description]
   * @return {ViewportMouseEvent}   [description]
   */
  private _toViewportMouseArgs(e: MouseEvent): ViewportMouseEvent {
    const ro = this._getRelativePosition(e);
    const r = this.viewport.toLocal(ro[0], ro[1]);
    const n = this.viewport.toLocalNormalized(ro[0], ro[1]);
    return {
      ...e,
      viewportX: r[0],
      viewportY: r[1],
      viewportNormalizedX: n[0],
      viewportNormalizedY: n[1],
      canvasX: ro[0],
      canvasY: ro[1],
      canvasNormalizedX: ro[0] / ro[2],
      canvasNormalizedY: ro[1] / ro[3],
      inside: this._isViewportInside(e),
    };
  }
}
