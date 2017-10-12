import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import ViewportBaseMouseState from "../../Objects/ViewportBaseMouseState";
import ViewportMouseEvent from "../../Objects/ViewportMouseEvent";
export default class RenderStageBase extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {

  };

  public rendererDescription: { [key: string]: any } = {
    mouse: {
      coords: {
        canvas: [0, 0],
        canvasNormalized: [0, 0],
        viewport: [0, 0],
        viewportNormalized: [0, 0],
      },
      left: false,
      right: false,
      inside: false,
    } as ViewportBaseMouseState,
  };

  public $mousemove(v: ViewportMouseEvent): void {
    this._assignMouseState(v);
  }

  public $mouseenter(v: ViewportMouseEvent): void {
    this._assignMouseState(v);
  }

  public $mouseleave(v: ViewportMouseEvent): void {
    this._assignMouseState(v);
  }

  public $mousedown(v: ViewportMouseEvent): void {
    this._assignMouseState(v);
  }

  public $mouseup(v: ViewportMouseEvent): void {
    this._assignMouseState(v);
  }

  private _assignMouseState(v: ViewportMouseEvent): void {
    const mouseDesc: ViewportBaseMouseState = this.rendererDescription["mouse"];
    mouseDesc.inside = v.inside;
    mouseDesc.coords["viewport"] = [v.viewportX, v.viewportY];
    mouseDesc.coords["viewportNormalized"] = [v.viewportNormalizedX, v.viewportNormalizedY];
    mouseDesc.coords["canvas"] = [v.canvasX, v.canvasY];
    mouseDesc.coords["canvasNormalized"] = [v.canvasNormalizedX, v.canvasNormalizedY];
    mouseDesc.left = this._isLeftButtonPressed(v);
    mouseDesc.right = this._isRightButtonPressed(v);
  }

  private _isLeftButtonPressed(v: ViewportMouseEvent): boolean {
    return v.buttons === 1 || (v.buttons === void 0 && v.which === 1);
  }

  private _isRightButtonPressed(v: ViewportMouseEvent): boolean {
    return v.buttons === 2 || (v.buttons === void 0 && v.which === 3);
  }
}
