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

  public $treeInitializing(c: HTMLScriptElement): void {
    if (this._isContainedInBody(c)) {
      // canvas should be placed siblings of the script tag
      this._generateCanvas(c.parentElement);
    } else {
      // TODO for the script element not included in body tag
    }
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
    parent.appendChild(generatedCanvas);
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
    if (!tag.parentElement) return false;
    if (tag.parentNode.nodeName === "BODY") return true;
    return this._isContainedInBody(tag.parentElement);
  }
}

export default CanvasInitializerComponent;
