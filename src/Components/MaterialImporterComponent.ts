import gr from "grimoirejs";
import MaterialFactory from "../Material/MaterialFactory";
const Component = gr.Node.Component;
const IAttributeDeclaration = gr.Node.IAttributeDeclaration;

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
