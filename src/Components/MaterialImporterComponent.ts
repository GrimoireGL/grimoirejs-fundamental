import gr from "grimoirejs";
import MaterialFactory from "../Material/MaterialFactory";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

export default class MaterialImporterComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    typeName: {
      default: null,
      converter: "String"
    },
    src: {
      default: null,
      converter: "String"
    }
  };

  public $awake(): void {
    if (!this.getAttribute("typeName") || !this.getAttribute("src")) {
      throw new Error("type or src cannot be null in material importer");
    } else {
      MaterialFactory.addSORTMaterialFromURL(this.getAttribute("typeName"), this.getAttribute("src"));
    }
  }
}
