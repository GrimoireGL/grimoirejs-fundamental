import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Material from "../Material/Material";
import MaterialFactory from "../Material/MaterialFactory";
import CanvasInitializerComponent from "./CanvasInitializerComponent";
import MaterialContainerBase from "./MaterialContainerBase";
export default class MaterialComponent extends MaterialContainerBase {
  public static componentName = "Material";
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    type: {
      converter: "String",
      default: null,
    },
  };

  public materialPromise: Promise<Material>;

  public material: Material;

  public ready: boolean;

  public materialArgs: { [key: string]: any } = {};

  protected $mount(): void {
    const typeName = this.getAttribute("type");
    if (typeName && typeof typeName === "string") {
      const materialFactory = MaterialFactory.get(this.companion.get(CanvasInitializerComponent.COMPANION_KEY_GL));
      this.materialPromise = materialFactory.instanciate(typeName);
      this._registerAttributes();
    } else {
      throw new Error("Material type name must be sppecified and string");
    }
  }

  private async _registerAttributes(): Promise<void> {
    this.material = await this.materialPromise;
    this.__exposeMaterialParameters(this.material);
    this.ready = true;
  }
}
