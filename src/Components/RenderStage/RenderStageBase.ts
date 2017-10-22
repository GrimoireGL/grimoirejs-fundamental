import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IViewportBaseMouseState from "../../Objects/ViewportBaseMouseState";
import IViewportMouseEvent from "../../Objects/ViewportMouseEvent";

/**
 * no document
 */
export default class RenderStageBase extends Component {
  /**
   * no document
   */
  public static attributes: { [key: string]: IAttributeDeclaration } = {

  };

  /**
   * no document
   */
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
    } as IViewportBaseMouseState,
  };

  protected $mousemove(v: IViewportMouseEvent): void {
    this._assignMouseState(v);
  }

  protected $mouseenter(v: IViewportMouseEvent): void {
    this._assignMouseState(v);
  }

  protected $mouseleave(v: IViewportMouseEvent): void {
    this._assignMouseState(v);
  }

  protected $mousedown(v: IViewportMouseEvent): void {
    this._assignMouseState(v);
  }

  protected $mouseup(v: IViewportMouseEvent): void {
    this._assignMouseState(v);
  }

  private _assignMouseState(v: IViewportMouseEvent): void {
    const mouseDesc: IViewportBaseMouseState = this.rendererDescription["mouse"];
    mouseDesc.inside = v.inside;
    mouseDesc.coords["viewport"] = [v.viewportX, v.viewportY];
    mouseDesc.coords["viewportNormalized"] = [v.viewportNormalizedX, v.viewportNormalizedY];
    mouseDesc.coords["canvas"] = [v.canvasX, v.canvasY];
    mouseDesc.coords["canvasNormalized"] = [v.canvasNormalizedX, v.canvasNormalizedY];
    mouseDesc.left = this._isLeftButtonPressed(v);
    mouseDesc.right = this._isRightButtonPressed(v);
  }

  private _isLeftButtonPressed(v: IViewportMouseEvent): boolean {
    return v.buttons === 1 || (v.buttons === void 0 && v.which === 1);
  }

  private _isRightButtonPressed(v: IViewportMouseEvent): boolean {
    return v.buttons === 2 || (v.buttons === void 0 && v.which === 3);
  }
}
