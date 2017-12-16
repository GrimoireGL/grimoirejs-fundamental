import Namespace from "grimoirejs/ref/Core/Namespace";
import gr from "grimoirejs/ref/Core/GrimoireInterface";
import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import CanvasSizeObject from "../Objects/CanvasSizeObject";
import GLExtRequestor from "../Resource/GLExtRequestor";
import Texture2D from "../Resource/Texture2D";
import WebGLRenderingContextWithId from "../Resource/WebGLRenderingContextWithId";
const ns = Namespace.define("grimoirejs-fundamental");

enum ResizeMode {
  Aspect,
  Fit,
  Manual,
}

/**
 * キャンバスの初期化及び設定を司るコンポーネント
 * このコンポーネントによって、適切な位置に`<canvas>`を初期化してWebGLコンテキストを初期化します。
 */
export default class CanvasInitializerComponent extends Component {
  public static componentName = "CanvasInitializer";
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * キャンバスタグの横幅を指定します。
     */
    width: {
      default: "fit",
      converter: "CanvasSize",
    },
    /**
     * キャンバスタグの縦幅を指定します。
     */
    height: {
      default: "fit",
      converter: "CanvasSize",
    },
    /**
     * キャンバス要素の直接の親要素のコンテナに割り当てるidを指定します。
     */
    containerId: {
      default: "",
      converter: "String",
    },
    /**
     * キャンバス要素の直接の親要素のコンテナに割り当てるクラス名を指定します。
     */
    containerClass: {
      default: "gr-container",
      converter: "String",
    },
    /**
     * GLコンテキストの初期化時に、preserveDrawingBufferフラグを有効にするか指定します。
     *
     * 描画結果をdataURLに変換する際などはこの属性がtrueでないと正常にレンダリング結果を取得できません。
     */
    preserveDrawingBuffer: {
      default: true,
      converter: "Boolean",
    },
    /**
     * GLコンテキストの初期化時に、MSAAによるアンチエイリアスを有効にするか指定します。
     *
     * この属性は、途中で動的に変更することができません。
     */
    antialias: {
      default: true,
      converter: "Boolean",
    },
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

  // Ratio of aspect
  private _ratio: number;

  protected $awake(): void {
    this._scriptTag = this.companion.get("scriptElement");
    if (this._isContainedInBody(this._scriptTag)) {
      // canvas should be placed siblings of the script tag
      this._generateCanvas(this._scriptTag);
    } else {
      throw new Error("goml script should have body as ancesotor to instanciate canvas element in the location");
    }
    // apply sizes on changed
    this.getAttributeRaw("width").watch(() => {
      this._resize();
    });
    this.getAttributeRaw("height").watch(() => {
      this._resize();
    });
    this.getAttributeRaw("antialias").watch(() => {
      console.warn("Changing antialias attribute is not supported. This is only works when the canvas element created.");
    });
    this.getAttributeRaw("preserveDrawingBuffer").watch(() => {
      console.warn("Changing preserveDrawingBuffer attribute is not supported. This is only works when the canvas element created.");
    });
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
    this.companion.set(ns.for("GLExtRequestor"), new GLExtRequestor(gl));
    Texture2D.generateDefaultTexture(gl);
    return this.canvas;
  }

  private _resize(supressBroadcast?: boolean): void {
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
      this._applyManualWidth(size[0], supressBroadcast);
    }
    if (this._heightMode === ResizeMode.Fit) {
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

  private _getParentSize(): number[] {
    const parent = this._canvasContainer.parentElement;
    const cs = getComputedStyle(parent);

    const paddingX = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight);
    const paddingY = parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);

    const borderX = parseFloat(cs.borderLeftWidth) + parseFloat(cs.borderRightWidth);
    const borderY = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);

    // Element width and height minus padding and border
    const elementWidth = parent.offsetWidth - paddingX - borderX;
    const elementHeight = parent.offsetHeight - paddingY - borderY;
    return [elementWidth, elementHeight];
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
    this.companion.set(ns.for("canvasContainer"), this._canvasContainer);
    scriptTag.parentElement.insertBefore(this._canvasContainer, scriptTag.nextSibling);
    this._resize(true);
  }

  private _getContext(canvas: HTMLCanvasElement): WebGLRenderingContextWithId {
    const contextConfig = {
      antialias: this.getAttribute("antialias"),
      preserveDrawingBuffer: this.getAttribute("preserveDrawingBuffer"),
    };
    let context: WebGLRenderingContext = canvas.getContext("webgl", contextConfig) as WebGLRenderingContext;
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
