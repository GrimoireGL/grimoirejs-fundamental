import gr from "grimoirejs";
import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import NameResolver from "../Asset/NameResolver";
import MaterialFactory from "../Material/MaterialFactory";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { attribute, readonly } from "grimoirejs/ref/Core/Decorator";
/**
 * Provides custom material importing
 * 
 */
export default class MaterialImporter extends Component {
  public static componentName = "MaterialImporter";
  /**
   * Name to beregistered.
   * You can instanciate or use material using this name.
   */
  @readonly()
  @attribute(StringConverter, null)
  public typeName!: string;
  /**
   * Destination of sort file path.
   */
  @readonly()
  @attribute(StringConverter, null)
  public src!: string;

  protected $awake(): void {
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
