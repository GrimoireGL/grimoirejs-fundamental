import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import gr from "grimoirejs";
const ns = gr.ns("HTTP://GRIMOIRE.GL/NS/DEFAULT");
class CanvasInitializerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    width: {
      defaultValue: 640,
      converter: "number"
    },
    height: {
      defaultValue: 480,
      converter: "number"
    }
  };

  /**
   * The canvas managed by this component
   * @type {HTMLCanvasElement}
   */
  public canvas: HTMLCanvasElement;

  private _scriptTag: HTMLScriptElement;

  public $awake(): void {
    this._scriptTag = this.sharedObject.get("scriptElement");
    if (this._isContainedInBody(this._scriptTag)) {
      // canvas should be placed siblings of the script tag
      this._generateCanvas(this._scriptTag.parentElement);
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
  private _generateCanvas(parent: Element): HTMLCanvasElement {
    const generatedCanvas = document.createElement("canvas");
    generatedCanvas.width = this.attributes.get("width").Value;
    generatedCanvas.height = this.attributes.get("height").Value;
    this.sharedObject.set(ns("gl"), this._getContext(generatedCanvas));
    this.sharedObject.set(ns("canvasElement"), generatedCanvas);
    parent.appendChild(generatedCanvas);
    this.canvas = generatedCanvas;
    return generatedCanvas;
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
