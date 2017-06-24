import gr from "grimoirejs";
import MaterialFactory from "../Material/MaterialFactory";
import Material from "../Material/Material";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import ResourceBase from "../Resource/ResourceBase";
import MaterialContainerBase from "./MaterialContainerBase";

export default class MaterialComponent extends MaterialContainerBase {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        type: {
            converter: "String",
            default: null
        }
    };

    public materialPromise: Promise<Material>;

    public material: Material;

    public ready: boolean;

    public materialArgs: { [key: string]: any } = {};

    public $mount(): void {
        const typeName = this.getAttribute("type");
        if (typeName && typeof typeName === "string") {
            this.materialPromise = (this.companion.get("MaterialFactory") as MaterialFactory).instanciate(typeName);
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
