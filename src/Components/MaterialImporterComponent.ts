import MaterialFactory from "../Material/MaterialFactory";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";

export default class MaterialImporterComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    typeName: {
      defaultValue: undefined,
      converter: "String"
    },
    src: {
      defaultValue: undefined,
      converter: "String"
    }
  };

  public $awake(): void {
    if (!this.getValue("typeName") || !this.getValue("src")) {
      throw new Error("type or src cannot be null in material importer");
    } else {
      MaterialFactory.addSORTMaterialFromURL(this.getValue("typeName"), this.getValue("src"));
    }
  }
}
