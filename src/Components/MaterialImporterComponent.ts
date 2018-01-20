import gr from "grimoirejs";
import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import NameResolver from "../Asset/NameResolver";
import MaterialFactory from "../Material/MaterialFactory";

/**
 * Provides custom material importing
 */
export default class MaterialImporter extends Component {
  public static componentName = "MaterialImporter";
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * Name to be registered as new material
     */
    typeName: {
      default: null,
      converter: "String",
    },
    /**
     * Destination filepath
     */
    src: {
      default: null,
      converter: "String",
    },
  };

  protected $awake(): void {
    this.getAttributeRaw("typeName").watch(() => {
      console.warn("Changeing 'typeName' on MaterialImporter makes no sense. This change won't affect anything.");
    });
    this.getAttributeRaw("src").watch(() => {
      console.warn("Changeing 'src' on MaterialImporter makes no sense. This change won't affect anything.");
    });
    if (!this.getAttribute("typeName") || !this.getAttribute("src")) {
      throw new Error("type or src cannot be null in material importer");
    } else {
      const typeName = this.getAttribute("typeName") as string;
      if (MaterialFactory.getMaterialStatus(typeName) !== NameResolver.UNLOADED && gr.debug) {
        console.warn(`Material name ${typeName} is already registered. Imported new material will be ignored. (This message will not be shown when you set gr.debug = false)`);
        return;
      }
      MaterialFactory.addSORTMaterialFromURL(this.getAttribute("typeName"), this.getAttribute("src"));
    }
  }
}
