import AssetLoader from "../Asset/AssetLoader";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";
import gr from "grimoirejs";
import DefaultLoaderChunk from "../Asset/defaultLoader.html";

export default class AssetLoadingManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    loadingProgress: {
      defaultValue: 0,
      converter: "Number"
    },
    autoStart: {
      defaultValue: true,
      converter: "Boolean"
    }
  };

  public loader: AssetLoader = new AssetLoader();

  private _documentResolver: () => void;

  private _loaderElement: Element;

  public $treeInitialized(): void {
    if (this.attributes.get("autoStart").Value) {
      this._autoStart();
    }
    this._documentResolver();
  }

  public $awake(): void {
    this.companion.set(gr.ns(this.name.ns)("loader"), this.loader);
    this.loader.register(new Promise((resolve) => { this._documentResolver = resolve; }));
    const canvasContainer = this.companion.get("canvasContainer") as HTMLDivElement;
    const loaderContainer = document.createElement("div");
    loaderContainer.innerHTML = DefaultLoaderChunk;
    loaderContainer.style.width = loaderContainer.style.height = "100%";
    canvasContainer.appendChild(loaderContainer);
    this._loaderElement = loaderContainer;
  }

  private async _autoStart(): Promise<void> {
    await this.loader.promise;
    this._loaderElement.remove();
    this.tree("goml").attr("loopEnabled", true);
  }
}
