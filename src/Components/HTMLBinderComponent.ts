import IRenderArgument from "../SceneRenderer/IRenderArgument";
import gr from "grimoirejs";
import TransformComponent from "./TransformComponent";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import CameraComponent from "./CameraComponent";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Vector4 from "grimoirejs-math/ref/Vector4";
import Matrix from "grimoirejs-math/ref/Matrix";

/**
 * (Deprecated)DOM要素とTransformを同期させるためのコンポーネント
 *
 * このコンポーネントはfundamentalからは削除されます。(別のパッケージとして分離予定)
 */
export default class HTMLBinderComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    htmlQuery: {
      default: null,
      converter: "String"
    },
    targetRenderer: {
      default: "render-scene",
      converter: "String"
    }
  };

  private _targetNode: GomlNode;

  private _htmlQuery: string;

  private _rendererQuery: string;

  private _queriedElement: HTMLElement;

  private _parentCache: Element;

  private _canvasContainer: HTMLDivElement;

  private _currentTransform: TransformComponent;

  private _styleCache: { [key: string]: any };

  private _isFirstCall: boolean = true;

  public $awake(): void {
    this._canvasContainer = this.companion.get("canvasContainer") as HTMLDivElement;
    this._currentTransform = this.node.getComponent(TransformComponent);
  }

  public $mount(): void {
    this._canvasContainer = this.companion.get("canvasContainer") as HTMLDivElement;
    this._currentTransform = this.node.getComponent(TransformComponent);
    this.node.on("render", this._onRender.bind(this));
  }

  public $treeInitialized(): void {
    this.getAttributeRaw("targetRenderer").watch((v) => {
      if (this._rendererQuery !== v) {
        this._onRendererChanged();
      }
    }, true);
    this.getAttributeRaw("htmlQuery").watch((v) => {
      this._onQueryChanged(v);
    }, true);
  }

  private _onRender(args: IRenderArgument): void {
    if (this._isFirstCall) {
      this._onRendererChanged();
      this._isFirstCall = false;
    }
    if (this._queriedElement && args.caller.node === this._targetNode) {
      const vp = args.viewport;
      const rawPos = Matrix.transform(this._currentTransform.calcPVM(args.camera), new Vector4(0, 0, 0, 1));
      const rawScPos = {
        x: rawPos.X / rawPos.W,
        y: rawPos.Y / rawPos.W,
        z: rawPos.Z / rawPos.W
      };
      if (rawScPos.z >= -1 && rawScPos.z <= 1) {
        const scPos = {
          x: vp.Left + (rawScPos.x + 1) / 2 * vp.Width,
          y: vp.Top + (rawScPos.y + 1) / 2 * vp.Height,
        };
        this._queriedElement.style.visibility = "visible";
        this._queriedElement.style.left = scPos.x + "px";
        this._queriedElement.style.bottom = scPos.y + "px";
      } else {
        this._queriedElement.style.visibility = "hidden";
      }
    }
  }

  /**
   * Restore default position of queried html
   */
  private _restoreDefault(): void {
    this._canvasContainer.removeChild(this._queriedElement)
    this._parentCache.appendChild(this._queriedElement);
    const s = this._queriedElement.style;
    const c = this._styleCache;
    s.position = c["position"];
    s.left = c["left"];
    s.bottom = c["bottom"];
    s.visibility = c["visibility"];
  }

  private _beginTrack(): void {
    this._parentCache.removeChild(this._queriedElement);
    this._canvasContainer.appendChild(this._queriedElement);
    this._queriedElement.style.position = "absolute";
  }

  private _onRendererChanged(): void {
    let returned = false;
    this.tree(this.getAttribute("targetRenderer")).forEach(n => { // should be obtained by get api
      if (returned) {
        return true;
      } else {
        this._targetNode = n;
        returned = true;
      }
    });
  }

  private _onQueryChanged(query: string): void {
    let queried: NodeListOf<Element>;
    if (query && query !== "") { // when query is not empty
      queried = document.querySelectorAll(query);
    }
    if (this._queriedElement) { // If there was selected element last time.
      this._restoreDefault();
    }
    if (!queried || queried.length === 0) { // If new queried object is empty
      this._queriedElement = undefined;
      this._parentCache = undefined;
    } else { // If there was object to track
      this._queriedElement = queried.item(0) as HTMLElement;
      const s = this._queriedElement.style;
      this._styleCache = {
        position: s.position,
        visibility: s.visibility,
        left: s.left,
        bottom: s.bottom
      };
      this._parentCache = this._queriedElement.parentElement;
      this._beginTrack();
    }
  }
}
