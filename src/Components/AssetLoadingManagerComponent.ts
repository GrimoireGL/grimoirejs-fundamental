import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import DefaultLoaderChunk from "raw-loader!../Asset/defaultLoader.html";
import AssetLoader from "../Asset/AssetLoader";

/**
 * アセットの読み込みを司るコンポーネント。ローダーの表示などを司る。
 */
export default class AssetLoadingManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * ローディング状況(読み取り専用)
     *
     * 現在の読み込み状況を0-1で表す。
     */
    loadingProgress: {
      default: 0,
      converter: "Number",
    },
    /**
     * リソースの読み込み完了後に、自動的にレンダリングループを開始するかどうか
     */
    autoStart: {
      default: true,
      converter: "Boolean",
    },
    /**
     * リソースのロード時にローディング画面を表示するかどうか
     */
    enableLoader: {
      default: true,
      converter: "Boolean",
    },
  };

  public loader: AssetLoader = new AssetLoader();

  private _documentResolver: () => void;

  private _loaderElement: Element;

  public $treeInitialized(): void {
    if (this.getAttribute("autoStart")) {
      this._autoStart();
    }
    this._documentResolver();
  }

  public $awake(): void {
    this.companion.set(this.name.ns.for("loader"), this.loader);
    this.loader.register(new Promise((resolve) => { this._documentResolver = resolve; }), this);
    const canvasContainer = this.companion.get("canvasContainer") as HTMLDivElement;
    if (!this.getAttribute("enableLoader")) {
      return;
    }
    const loaderContainer = document.createElement("div");
    loaderContainer.innerHTML = DefaultLoaderChunk;
    loaderContainer.style.width = loaderContainer.style.height = "100%";
    canvasContainer.appendChild(loaderContainer);
    this._loaderElement = loaderContainer;
  }

  private async _autoStart(): Promise<void> {
    await this.loader.promise;
    if (this._loaderElement) {
      this._loaderElement.remove();
    }
    this.node.emit("asset-load-completed");
    this.tree("goml").setAttribute("loopEnabled", true);
    const canvas = this.companion.get("canvasElement") as HTMLCanvasElement;
    canvas.classList.add("gr-resource-loaded-canvas");
  }
}
