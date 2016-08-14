import AssetLoader from "../Asset/AssetLoader";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

export default class AssetLoadingManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    loadingProgress: {
      defaultValue: 0,
      converter: "number"
    }
  };

  public loader: AssetLoader = new AssetLoader();

  private _documentResolver: () => void;

  public $treeInitialized(): void {
    this._documentResolver();
  }

  public $awake(): void {
    this.loader.register(new Promise((resolve) => { this._documentResolver = resolve; }));
  }
}
