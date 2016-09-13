import MaterialFactory from "../Material/MaterialFactory";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";

export default class MaterialImporterComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    type: {
      defaultValue: undefined,
      converter: "string"
    },
    src: {
      defaultValue: undefined,
      converter: "string"
    }
  };

  public $mount(): void {
    if (!this.getValue("type") || !this.getValue("src")) {
      throw new Error("type or src cannot be null in material importer");
    } else {
      MaterialFactory.addSORTMaterialFromURL(this.getValue("type"), this.getValue("src"));
    }
  }
}
