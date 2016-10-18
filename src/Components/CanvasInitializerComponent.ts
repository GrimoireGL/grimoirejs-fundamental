import GLExtRequestor from "../Resource/GLExtRequestor";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";
import gr from "grimoirejs";
const ns = gr.ns("HTTP://GRIMOIRE.GL/NS/DEFAULT");
class CanvasInitializerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    width: {
      defaultValue: 640,
      converter: "Number"
    },
    height: {
      defaultValue: 480,
      converter: "Number"
    },
    containerId: {
      defaultValue: undefined,
      converter: "String"
    },
    containerClass: {
      defaultValue: "gr-container",
      converter: "String"
    }
  };

  /**
   * The canvas managed by this component
   * @type {HTMLCanvasElement}
   */
  public canvas: HTMLCanvasElement;

  private _scriptTag: HTMLScriptElement;

  public $awake(): void {
    this._scriptTag = this.companion.get("scriptElement");
    if (this._isContainedInBody(this._scriptTag)) {
      // canvas should be placed siblings of the script tag
      this._generateCanvas(this._scriptTag);
    } else {
      // TODO for the script element not included in body tag
    }
    // apply sizes on changed
    this.attributes.get("width").addObserver((v) => {
      this.canvas.width = v.Value;
    });
    this.attributes.get("height").addObserver((v) => {
      this.canvas.height = v.Value;
    });
  }

  /**
   * Generate canvas element
   * @param  {Element}           parent [description]
   * @return {HTMLCanvasElement}        [description]
   */
  private _generateCanvas(scriptTag: Element): HTMLCanvasElement {
    const generatedCanvas = document.createElement("canvas");
    this._configureCanvas(generatedCanvas, scriptTag as HTMLScriptElement);
    const gl = this._getContext(generatedCanvas);
    this.companion.set(ns("gl"), gl);
    this.companion.set(ns("canvasElement"), generatedCanvas);
    this.companion.set(ns("GLExtRequestor"), new GLExtRequestor(gl));
    this.canvas = generatedCanvas;
    return generatedCanvas;
  }

  private _configureCanvas(canvas: HTMLCanvasElement, scriptTag: HTMLScriptElement): void {
    canvas.width = this.getAttribute("width").Value;
    canvas.height = this.getAttribute("height").Value;
    canvas.style.position = "absolute";
    canvas.style.top = "0px";
    const canvasContainer = document.createElement("div");
    canvasContainer.style.width = canvas.width + "px";
    canvasContainer.style.height = canvas.height + "px";
    canvasContainer.style.position = "relative";
    canvasContainer.appendChild(canvas);
    if (this.getValue("containerId")) {
      canvasContainer.id = this.getValue("containerId");
    }
    if (this.getValue("containerClass")) {
      canvasContainer.className = this.getValue("containerClass");
    }
    this.companion.set(ns("canvasContainer"), canvasContainer);
    scriptTag.parentElement.insertBefore(canvasContainer, scriptTag.nextSibling);
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
}

export default CanvasInitializerComponent;
