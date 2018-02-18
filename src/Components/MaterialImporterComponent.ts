import gr from "grimoirejs";
import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import NameResolver from "../Asset/NameResolver";
import MaterialFactory from "../Material/MaterialFactory";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";
/**
 * Provides custom material importing
 */
export default class MaterialImporter extends Component {
  public static componentName = "MaterialImporter";
  public static attributes = {
    /**
     * Name to be registered as new material
     */
    typeName: {
      default: null,
      converter: StringConverter,
    },
    /**
     * Destination filepath
     */
    src: {
      default: null,
      converter: StringConverter,
    },
  };

  protected $awake(): void {
    this.getAttributeRaw(MaterialImporter.attributes.typeName)!.watch(() => {
      console.warn("Changeing 'typeName' on MaterialImporter makes no sense. This change won't affect anything.");
    });
    this.getAttributeRaw(MaterialImporter.attributes.src)!.watch(() => {
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
