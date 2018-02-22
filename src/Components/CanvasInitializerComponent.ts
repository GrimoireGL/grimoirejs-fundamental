import Namespace from "grimoirejs/ref/Core/Namespace";
import gr from "grimoirejs/ref/Core/GrimoireInterface";
import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import CanvasSizeObject, { ResizeMode } from "../Objects/CanvasSizeObject";
import GLExtRequestor from "../Resource/GLExtRequestor";
import Texture2D from "../Resource/Texture2D";
import StringConverter from "grimoirejs/ref/Converter/StringConverter";
import WebGLRenderingContextWithId from "../Resource/WebGLRenderingContextWithId";
import { IConverterDeclaration, IStandardConverterDeclaration } from "grimoirejs/ref/Interface/IAttributeConverterDeclaration";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import { CanvasSizeConverter } from "../Converters/CanvasSizeConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { companion, attribute, watch } from "grimoirejs/ref/Core/Decorator";
const ns = Namespace.define("grimoirejs-fundamental");

/**
 * CanvasInitializer provides initialization of <canvas> element.
 * This component is typically existing for each <goml> tag. And this node will insert <canvas> tag ideal location of the body.
 * This component also treat resizing for initialized canvas.
 */
export default class CanvasInitializerComponent extends Component {
  public static componentName = "CanvasInitializer";

  /**
   * Width of canvas
   */
  @attribute(CanvasSizeConverter, "fit")
  public width!: CanvasSizeObject;

  /**
   * Height of canvas
   */
  @attribute(CanvasSizeConverter, "fit")
  public height!: CanvasSizeObject;

  /**
   * ID attribute of HTMLElement assigned to container <div> element wrapping canvas element.
   */
  @attribute(StringConverter, "")
  public containerId!: string;

  /**
  * Container classes will be assigned as class name of <div> element wrapping the canvas.
  */
  @attribute(StringConverter, "gr-container")
  public containerClass!: string;

  /**
   * Flag of initializng GL context.
   * If you needs to fetch canvas data by dataURI or something other way, You may need to assign this value as true for fetching canvas data correctly.
   * This value can't be changed after GL context initialized.
   */
  @attribute(BooleanConverter, true)
  public preserveDrawingBuffer!: boolean;

  /**
   * Flag of using MSAA antialiasing.
   * This value can't be changed after GL context initialized.
   */
  @attribute(BooleanConverter, true)
  public antialias!: boolean;

  /**
   * Flag of required WebGL version. Available options are listed below.
   * - 1.0 ・・・Requests only WebGL1.0(Even if WebGL2.0 is available)
   * - 2.0 ・・・Requests WebGL2.0(Will be fail if WebGL2.0 is not available)
   * - null・・・Prefer WebGL2.0. but use WebGL1.0 if the context is not available
   */
  @attribute(StringConverter, null)
  public requiredGLVersion!: string;

  /**
   * The canvas managed by this component
   * @type {HTMLCanvasElement}
   */
  public canvas!: HTMLCanvasElement;
  @companion("scriptElement")
  private _scriptTag!: HTMLScriptElement;

  private _canvasContainer!: HTMLDivElement;

  // Ratio of aspect
  private _ratio!: number;

  protected $awake(): void {
    if (this._isContainedInBody(this._scriptTag)) {
      // canvas should be placed siblings of the script tag
      this._generateCanvas(this._scriptTag);
    } else {
      throw new Error("goml script should have body as ancesotor to instanciate canvas element in the location");
    }
  }

  public notifySizeChanged(): void {
    this._onWindowResize();
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
    this.companion.set(ns.for("gl"), gl);
    this.companion.set(ns.for("canvasElement"), this.canvas);
    this.companion.set(ns.for("GLExtRequestor"), GLExtRequestor.get(gl));
    Texture2D.generateDefaultTexture(gl);
    return this.canvas;
  }

  private _resize(supressBroadcast?: boolean): void {
    if (this.width === this.height && this.width.mode === "aspect") {
      throw new Error("Width and height could not have aspect mode in same time!");
    }
    if (this.width.mode === "aspect") {
      this._ratio = this.width.aspect;
    }
    if (this.height.mode === "aspect") {
      this._ratio = this.height.aspect;
    }
    if (this.width.mode === "manual") {
      this._applyManualWidth(this.width.size, supressBroadcast);
    }
    if (this.height.mode === "manual") {
      this._applyManualHeight(this.height.size, supressBroadcast);
    }
    this._onWindowResize(supressBroadcast);
  }

  private _onWindowResize(supressBroadcast?: boolean): void {
    const size = this._getParentSize();
    if (this.width.mode === "fit") {
      this._applyManualWidth(size[0], supressBroadcast);
    }
    if (this.height.mode === "fit") {
      if (size[1] === 0 && gr.debug) {
        console.warn("Canvas height parameter specified as fit and height of parent element is 0.\n This is possibly the reason you haven't set css to html or body element.");
      }
      this._applyManualHeight(size[1], supressBroadcast);
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
    if (this.height.mode === "aspect") {
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
    if (this.width.mode === "aspect") {
      this._applyManualWidth(height * this._ratio, supressBroadcast);
    }
  }

  private _getParentSize(): number[] {
    const parent = this._canvasContainer.parentElement!;
    const cs = getComputedStyle(parent);

    const paddingX = parseFloat(cs.paddingLeft!) + parseFloat(cs.paddingRight!);
    const paddingY = parseFloat(cs.paddingTop!) + parseFloat(cs.paddingBottom!);

    const borderX = parseFloat(cs.borderLeftWidth!) + parseFloat(cs.borderRightWidth!);
    const borderY = parseFloat(cs.borderTopWidth!) + parseFloat(cs.borderBottomWidth!);

    // Element width and height minus padding and border
    const elementWidth = parent.offsetWidth - paddingX - borderX;
    const elementHeight = parent.offsetHeight - paddingY - borderY;
    return [elementWidth, elementHeight];
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
    this.companion.set(ns.for("canvasContainer"), this._canvasContainer);
    scriptTag.parentElement!.insertBefore(this._canvasContainer, scriptTag.nextSibling);
    this._resize(true);
  }

  private _getContext(canvas: HTMLCanvasElement): WebGLRenderingContextWithId {
    const contextConfig = {
      antialias: this.getAttribute("antialias"),
      preserveDrawingBuffer: this.getAttribute("preserveDrawingBuffer"),
    };
    const glv = this.getAttribute("requiredGLVersion");
    let context!: WebGLRenderingContext;
    if (glv !== "1.0") {
      context = canvas.getContext("webgl2", contextConfig) as WebGLRenderingContext;
      if (glv === "2.0" && !context) {
        throw new Error(`WebGL 2.0 is requested. But this device is not supporting WebGL2.0.`);
      }
    }
    if (!context) {
      context = canvas.getContext("webgl", contextConfig) as WebGLRenderingContext;
    }
    if (!context) {
      context = canvas.getContext("experimental-webgl", contextConfig) as WebGLRenderingContext;
    }
    if (!context) {
      throw new Error("Failed to initializing WebGL context. Make sure your browser supporting WebGL.");
    }
    return this._applyContextId(context);
  }

  /**
   * Insert __id__property to be identify rendering contexts
   */
  private _applyContextId(context: WebGLRenderingContext): WebGLRenderingContextWithId {
    const contextWithId = context as WebGLRenderingContextWithId;
    contextWithId.__id__ = Math.random().toString(36).slice(-6); // Generating random string
    return contextWithId;
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
    if (tag.parentNode!.nodeName === "BODY") {
      return true;
    }
    return this._isContainedInBody(tag.parentElement);
  }

  private _autoFixForBody(scriptTag: Element): void {
    if (scriptTag.parentElement!.nodeName === "BODY") {
      const boudningBox = document.body.getBoundingClientRect();
      if (boudningBox.height === 0) { // If height of parent body is 0, expand body
        document.body.style.height = "100%";
        document.body.parentElement!.style.height = "100%";
      }
    }
  }

  @watch("width")
  @watch("height")
  private _onSizeParameterChanged(): void {
    this._resize();
  }

  @watch("antialias")
  @watch("preserveDrawingBuffer")
  private _onGLContextConfigurationChanged(): void {
    console.warn("You can't change 'antialias' or 'preserveDrawingBuffer' attribute after initialization. You should specify GOML directly to change the value before initialization.");
  }
}
