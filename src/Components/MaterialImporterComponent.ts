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
    this.getAttributeRaw("typeName").watch(v=>{
      console.warn(`Changeing 'typeName' on MaterialImporter makes no sense. This change won't affect anything.`);
    });
    this.getAttributeRaw("src").watch(v=>{
      console.warn(`Changeing 'src' on MaterialImporter makes no sense. This change won't affect anything.`);
    });
    if (!this.getAttribute("typeName") || !this.getAttribute("src")) {
      throw new Error("type or src cannot be null in material importer");
    } else {
      const typeName = this.getAttribute("typeName");
      if(MaterialFactory.factories[typeName] !== void 0){
        throw new Error(`A material type '${typeName}' is already loaded.`);
      }
      MaterialFactory.addSORTMaterialFromURL(this.getAttribute("typeName"), this.getAttribute("src"));
    }
  }
}
