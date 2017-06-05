import MaterialFactory from "../Material/MaterialFactory";
import Material from "../Material/Material";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";


export default class MaterialComponent extends Component {
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
    for (let key in this.material.argumentDeclarations) {
      this.__addAtribute(key, this.material.argumentDeclarations[key]);
      let lastValue;
      if (this.material.arguments[key] !== void 0) {
        lastValue = this.material.arguments[key];
      }
      this.getAttributeRaw(key).watch((n) => {
        this.material.setArgument(key, n);
      }, true);
      if (lastValue !== void 0) {
        this.material.setArgument(key, lastValue);
      }
    }
    for (let key in this.material.macroDeclarations) {
      this.__addAtribute(key, this.material.macroDeclarations[key]);
      this.getAttributeRaw(key).watch((v) => {
        this.material.setMacroValue(key, v);
      }, true);
    }
    this.ready = true;
  }
}
