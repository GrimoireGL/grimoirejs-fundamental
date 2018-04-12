import Component from "grimoirejs/ref/Core/Component";
import DefaultLoaderChunk from "raw-loader!../Asset/defaultLoader.html";
import AssetLoader from "../Asset/AssetLoader";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import BooleanConverter from "grimoirejs/ref/Converter/BooleanConverter";
import NumberConverter from "grimoirejs/ref/Converter/NumberConverter";
import { IStandardConverterDeclaration } from "grimoirejs/ref/Interface/IAttributeConverterDeclaration";
import Identity from "grimoirejs/ref/Core/Identity";
import { attribute } from "grimoirejs/ref/Core/Decorator";
/**
 * アセットの読み込みを司るコンポーネント。ローダーの表示などを司る。
 */
export default class AssetLoadingManagerComponent extends Component {
  public static componentName = "AssetLoadingManager";

  /**
   * Loading progress of entire assets triggered by this GOML structure.
   * By default, AssetLoader will wait for completing asset load until loadingProgress filled as 1.
   * This property is readonly property.
   */
  @attribute(NumberConverter, 0)
  public loadingProgress!: number;

  /**
   * Automatically assign true to LoopManager#loopEnabled or not.
   * You can specify this attribute on initialization timing only.
   */
  @attribute(BooleanConverter, true)
  public autoStart!: boolean;

  /**
   * Flag to show loader screen or not.
   */
  @attribute(BooleanConverter, true)
  public enableLoader!: boolean;

  /**
   * Asset loader referrence.
   */
  public loader: AssetLoader = new AssetLoader();

  private _documentResolver!: () => void;

  private _loaderElement!: Element;

  protected $treeInitialized(): void {
    if (this.autoStart) {
      this._autoStart();
    }
    this._documentResolver();
  }

  protected $awake(): void {
    this.companion.set(this.identity.ns.for("loader"), this.loader);
    this.loader.register(new Promise((resolve) => { this._documentResolver = resolve; }), this);
    const canvasContainer = this.companion.get("canvasContainer") as HTMLDivElement;
    if (!this.enableLoader) {
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
