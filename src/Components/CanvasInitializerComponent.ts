import gr from "grimoirejs/ref/GrimoireInterface";
import Texture2D from "../Resource/Texture2D";
import CanvasSizeObject from "../Objects/CanvasSizeObject";
import GLExtRequestor from "../Resource/GLExtRequestor";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
const ns = gr.ns("HTTP://GRIMOIRE.GL/NS/DEFAULT");

enum ResizeMode {
  Aspect,
  Fit,
  Manual
}

class CanvasInitializerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    width: {
      default: "fit",
      converter: "CanvasSize"
    },
    height: {
      default: "fit",
      converter: "CanvasSize"
    },
    containerId: {
      default: "",
      converter: "String"
    },
    containerClass: {
      default: "gr-container",
      converter: "String"
    }
  };

  /**
   * The canvas managed by this component
   * @type {HTMLCanvasElement}
   */
  public canvas: HTMLCanvasElement;

  private _scriptTag: HTMLScriptElement;

  private _canvasContainer: HTMLDivElement;

  // Resize mode of width
  private _widthMode: ResizeMode;

  // Resize mode of height
  private _heightMode: ResizeMode;

  /**
   * Default texture to be used when no texture was specified
   * @type {Texture2D}
   */
  private _defaultTexture: Texture2D;

  // Ratio of aspect
  private _ratio: number;

  public $awake(): void {
    this._scriptTag = this.companion.get("scriptElement");
    if (this._isContainedInBody(this._scriptTag)) {
      // canvas should be placed siblings of the script tag
      this._generateCanvas(this._scriptTag);
    } else {
      throw new Error("goml script should have body as ancesotor to instanciate canvas element in the location");
    }
    // apply sizes on changed
    this.getAttributeRaw("width").watch((v) => {
      this._resize();
    });
    this.getAttributeRaw("height").watch((v) => {
      this._resize();
    });
  }

  /**
   * Generate canvas element
   * @param  {Element}           parent [description]
   * @return {HTMLCanvasElement}        [description]
   */
  private _generateCanvas(scriptTag: Element): HTMLCanvasElement {
    this._autoFixForBody(scriptTag);
    this.canvas = document.createElement("canvas");
    window.addEventListener("resize", () => this._onWindowResize());
    this._configureCanvas(this.canvas, scriptTag as HTMLScriptElement);
    const gl = this._getContext(this.canvas);
    this._defaultTexture = new Texture2D(gl);
    this._defaultTexture.update(0, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    this.companion.set(ns("gl"), gl);
    this.companion.set(ns("canvasElement"), this.canvas);
    this.companion.set(ns("GLExtRequestor"), new GLExtRequestor(gl));
    this.companion.set(ns("defaultTexture"), this._defaultTexture);
    return this.canvas;
  }

  private _resize(supressBroadcast?: boolean): void {
    const canvas = this.companion.get("canvasElement");
    const widthRaw = this.getAttribute("width") as CanvasSizeObject;
    const heightRaw = this.getAttribute("height") as CanvasSizeObject;
    this._widthMode = this._asResizeMode(widthRaw);
    this._heightMode = this._asResizeMode(heightRaw);
    if (this._widthMode === this._heightMode && this._widthMode === ResizeMode.Aspect) {
      throw new Error("Width and height could not have aspect mode in same time!");
    }
    if (this._widthMode === ResizeMode.Aspect) {
      this._ratio = widthRaw.aspect;
    }
    if (this._heightMode === ResizeMode.Aspect) {
      this._ratio = heightRaw.aspect;
    }
    if (this._widthMode === ResizeMode.Manual) {
      this._applyManualWidth(widthRaw.size, supressBroadcast);
    }
    if (this._heightMode === ResizeMode.Manual) {
      this._applyManualHeight(heightRaw.size, supressBroadcast);
    }
    this._onWindowResize(supressBroadcast);
  }

  private _onWindowResize(supressBroadcast?: boolean): void {
    const size = this._getParentSize();
    if (this._widthMode === ResizeMode.Fit) {
      this._applyManualWidth(size.width, supressBroadcast);
    }
    if (this._heightMode === ResizeMode.Fit) {
      if (size.height === 0 && gr.debug) {
        console.warn("Canvas height parameter specified as fit and height of parent element is 0.\n This is possibly the reason you haven't set css to html or body element.");
      }
      this._applyManualHeight(size.height, supressBroadcast);
    }
  }

  private _applyManualWidth(width: number, supressBroadcast?: boolean): void {
    if (width === this.canvas.width) {
      return;
    }
    this.canvas.width = width;
    this._canvasContainer.style.width = width + "px";
    if (!supressBroadcast) {
      this.node.broadcastMessage(1, "resizeCanvas");
    }
    if (this._heightMode === ResizeMode.Aspect) {
      this._applyManualHeight(width / this._ratio, supressBroadcast);
    }
  }

  private _applyManualHeight(height: number, supressBroadcast?: boolean): void {
    if (height === this.canvas.height) {
      return;
    }
    this.canvas.height = height;
    this._canvasContainer.style.height = height + "px";
    if (!supressBroadcast) {
      this.node.broadcastMessage(1, "resizeCanvas");
    }
    if (this._widthMode === ResizeMode.Aspect) {
      this._applyManualWidth(height * this._ratio, supressBroadcast);
    }
  }

  private _getParentSize(): ClientRect {
    const parent = this._canvasContainer.parentElement as HTMLElement;
    const boundingBox = parent.getBoundingClientRect();
    return boundingBox;
  }

  /**
   * Get resize mode from raw attribute of height or width
   * @param  {string  | number}      mode [description]
   * @return {ResizeMode}   [description]
   */
  private _asResizeMode(cso: CanvasSizeObject): ResizeMode {
    if (cso.mode === "fit") {
      return ResizeMode.Fit;
    } else if (cso.mode === "aspect") {
      return ResizeMode.Aspect;
    } else {
      return ResizeMode.Manual;
    }
  }

  private _configureCanvas(canvas: HTMLCanvasElement, scriptTag: HTMLScriptElement): void {
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    canvas.style.left = "0px";
    this._canvasContainer = document.createElement("div");
    this._canvasContainer.style.position = "relative";
    this._canvasContainer.style.overflow = "hidden";
    this._canvasContainer.appendChild(canvas);
    if (this.getAttribute("containerId")) {
      this._canvasContainer.id = this.getAttribute("containerId");
    }
    if (this.getAttribute("containerClass")) {
      this._canvasContainer.className = this.getAttribute("containerClass");
    }
    this.companion.set(ns("canvasContainer"), this._canvasContainer);
    scriptTag.parentElement.insertBefore(this._canvasContainer, scriptTag.nextSibling);
    this._resize(true);
  }

  private _getContext(canvas: HTMLCanvasElement): WebGLRenderingContext {
    let context: WebGLRenderingContext = canvas.getContext("webgl") as WebGLRenderingContext;
    if (!context) {
      context = canvas.getContext("webgl-experimental") as WebGLRenderingContext;
    }
    return context;
  }

  /**
   * Check the tag is included in the body
   * @param  {Element} tag [description]
   * @return {boolean}     [description]
   */
  private _isContainedInBody(tag: Element): boolean {
    if (!tag.parentElement) {
      return false;
    }
    if (tag.parentNode.nodeName === "BODY") {
      return true;
    }
    return this._isContainedInBody(tag.parentElement);
  }

  private _autoFixForBody(scriptTag: Element): void {
    if (scriptTag.parentElement.nodeName === "BODY") {
      const boudningBox = document.body.getBoundingClientRect();
      if (boudningBox.height === 0) {
        document.body.style.height = "100%";
        document.body.parentElement.style.height = "100%";
      }
    }
  }
}

export default CanvasInitializerComponent;
