import gr from "grimoirejs";
import AssetLoader from "../Asset/AssetLoader";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import DefaultLoaderChunk from "raw!../Asset/defaultLoader.html";

export default class AssetLoadingManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    loadingProgress: {
      default: 0,
      converter: "Number"
    },
    autoStart: {
      default: true,
      converter: "Boolean"
    },
    anableLoader: {
      default: false,
      converter: "Boolean"
    }
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
    this.companion.set(gr.ns(this.name.ns)("loader"), this.loader);
    this.loader.register(new Promise((resolve) => { this._documentResolver = resolve; }));
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
  }
}
