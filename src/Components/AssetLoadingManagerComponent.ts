import Component from "grimoirejs/ref/Core/Component";
import DefaultLoaderChunk from "raw-loader!../Asset/defaultLoader.html";
import AssetLoader from "../Asset/AssetLoader";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import BooleanConverter from "grimoirejs/ref/Converter/BooleanConverter";
import NumberConverter from "grimoirejs/ref/Converter/NumberConverter";
import { IStandardConverterDeclaration } from "grimoirejs/ref/Interface/IAttributeConverterDeclaration";
import Identity from "grimoirejs/ref/Core/Identity";
/**
 * アセットの読み込みを司るコンポーネント。ローダーの表示などを司る。
 */
export default class AssetLoadingManagerComponent extends Component {
  public static componentName = "AssetLoadingManager";
  public static attributes = {
    /**
     * ローディング状況(読み取り専用)
     *
     * 現在の読み込み状況を0-1で表す。
     */
    loadingProgress: {
      default: 0,
      converter: NumberConverter,
    },
    /**
     * リソースの読み込み完了後に、自動的にレンダリングループを開始するかどうか
     */
    autoStart: {
      default: true,
      converter: BooleanConverter,
    },
    /**
     * リソースのロード時にローディング画面を表示するかどうか
     */
    enableLoader: {
      default: true,
      converter: BooleanConverter,
    },
  };

  public loader: AssetLoader = new AssetLoader();

  private _documentResolver!: () => void;

  private _loaderElement!: Element;

  protected $treeInitialized(): void {
    if (this.getAttribute("autoStart")) {
      this._autoStart();
    }
    this._documentResolver();
  }

  protected $awake(): void {
    this.companion.set(this.name.ns.for("loader"), this.loader);
    this.loader.register(new Promise((resolve) => { this._documentResolver = resolve; }), this);
    const canvasContainer = this.companion.get("canvasContainer") as HTMLDivElement;
    if (!this.getAttribute(AssetLoadingManagerComponent.attributes.enableLoader)) {
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
    this.node.emit("asset-load-completed", null);
    this.tree("goml").setAttribute("loopEnabled", true);
    const canvas = this.companion.get("canvasElement") as HTMLCanvasElement;
    canvas.classList.add("gr-resource-loaded-canvas");
  }
}
