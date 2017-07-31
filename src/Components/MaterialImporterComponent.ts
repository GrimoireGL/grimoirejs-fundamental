import MaterialFactory from "../Material/MaterialFactory";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

/**
 * マテリアル設定ファイルを読み込むためのコンポーネント
 */
export default class MaterialImporterComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * マテリアル名として登録される名前
     */
    typeName: {
      default: null,
      converter: "String"
    },
    /**
     * 読み込み先のファイルパス
     */
    src: {
      default: null,
      converter: "String"
    }
  };

  public $awake(): void {
    this.getAttributeRaw("typeName").watch(() => {
      console.warn(`Changeing 'typeName' on MaterialImporter makes no sense. This change won't affect anything.`);
    });
    this.getAttributeRaw("src").watch(() => {
      console.warn(`Changeing 'src' on MaterialImporter makes no sense. This change won't affect anything.`);
    });
    if (!this.getAttribute("typeName") || !this.getAttribute("src")) {
      throw new Error("type or src cannot be null in material importer");
    } else {
      const typeName = this.getAttribute("typeName") as string;
      if (MaterialFactory.factories[typeName] !== void 0) {
        throw new Error(`A material type '${typeName}' is already loaded.`);
      }
      MaterialFactory.addSORTMaterialFromURL(this.getAttribute("typeName"), this.getAttribute("src"));
    }
  }
}
