import Color4 from "grimoirejs-math/ref/Color4";
import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import MaterialFactory from "../Material/MaterialFactory";
import Timer from "../Util/Timer";
import CanvasInitializerComponent from "./CanvasInitializerComponent";
import LoopManagerComponent from "./LoopManagerComponent";
/**
 * 全レンダラーを管理するためのコンポーネント
 */
export default class RendererManagerComponent extends Component {
  public static componentName = "RendererManager";
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * キャンバスの初期化色
     */
    bgColor: {
      default: new Color4(0, 0, 0, 0),
      converter: "Color4",
    },
    /**
     * キャンバスの初期化深度値
     */
    clearDepth: {
      default: 1,
      converter: "Number",
    },
    /**
     * goml内にrendererが一つもなかった場合に自動的に補完するかどうか
     */
    complementRenderer: {
      default: true,
      converter: "Boolean",
    },
  };

  private static _sortImportedFromHTML = false;

  public gl: WebGLRenderingContext;

  private _bgColor: Color4;

  private _clearDepth: number;

  public onloop(timer: Timer): void {
    if (this.enabled) {
      const c: Color4 = this._bgColor;
      this.gl.clearColor(c.R, c.G, c.B, c.A);
      this.gl.clearDepth(this._clearDepth);
      this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
      this.node.broadcastMessage(1, "renderViewport", {
        timer,
      });
    }
  }

  protected $awake(): void {
    this.getAttributeRaw("bgColor").bindTo("_bgColor");
    this.getAttributeRaw("clearDepth").bindTo("_clearDepth");
  }

  protected $mount(): void {
    this.gl = this.companion.get(CanvasInitializerComponent.COMPANION_KEY_GL);
  }

  protected $treeInitialized(): void {
    this.node.getComponent(LoopManagerComponent).register(this.onloop.bind(this), 1000);
    if (this.getAttribute("complementRenderer") && this.node.getChildrenByNodeName("renderer").length === 0) {
      this.node.addChildByName("renderer");
    }
    this._importSortFromHTML();
  }

  private _importSortFromHTML(): void {
    if (RendererManagerComponent._sortImportedFromHTML) {
      return;
    }
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      const script = scripts.item(i);
      if (script.getAttribute("type") === "text/sort") { // If the script tag is for shader file
        const typeName = script.getAttribute("typeName");
        if (!typeName) {
          throw new Error("Every script tag with 'text/sort' type should have typeName attribute to specify the name to be registered as a material.");
        }
        if (script.getAttribute("src")) {
          MaterialFactory.addSORTMaterialFromURL(typeName, script.getAttribute("src"));
        } else {
          MaterialFactory.addSORTMaterial(typeName, script.innerText);
        }
      }
    }
    RendererManagerComponent._sortImportedFromHTML = true;
  }
}
