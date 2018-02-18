import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Material from "../Material/Material";
import MaterialFactory from "../Material/MaterialFactory";
import MaterialContainerBase from "./MaterialContainerBase";
/** 
 * Material component holds reference of material instance.
 * This is used in <material/> tag.
 * This component can contain additional attributes registered by shader.
*/
export default class MaterialComponent extends MaterialContainerBase {
    public static componentName = "Material"
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        type: {
            converter: "String",
            default: null,
        },
    };
    /**
     * Promise of material.
     * If this object is pending, the material is not initialized yet.
     */
    public materialPromise: Promise<Material>;

    /**
     * Reference to material.
     * Make sure this material component is ready. If not, material will be undefined.
     */
    public material: Material;

    /**
     * Flag to check material is initialized.
     * If this flag is not true, this material is not initialized yet.
     */
    public ready: boolean;

    protected $mount(): void {
        const typeName = this.getAttribute("type");
        if (typeName && typeof typeName === "string") {
            const materialFactory = MaterialFactory.get(this.companion.get("gl"));
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
