import AssetLoader from "../Asset/AssetLoader";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

export default class AssetLoadingManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    loadingProgress: {
      defaultValue: 0,
      converter: "number"
    },
    autoStart: {
      defaultValue: true,
      converter: "boolean"
    }
  };

  public loader: AssetLoader = new AssetLoader();

  private _documentResolver: () => void;

  public $treeInitialized(): void {
    if (this.attributes.get("autoStart").Value) {
      this._autoStart();
    }
    this._documentResolver();
  }

  public $awake(): void {
    this.loader.register(new Promise((resolve) => { this._documentResolver = resolve; }));
  }

  private async _autoStart(): Promise<void> {
    await this.loader.promise;
    this.tree("goml").attr("loopEnabled", true);
  }
}
