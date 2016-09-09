import MaterialFactory from "../Material/MaterialFactory";
import SORTPass from "../Material/SORTPass";
import Material from "../Material/Material";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";
import ResourceBase from "../Resource/ResourceBase";


export default class MaterialComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    type: {
      converter: "string",
      defaultValue: undefined
    }
  };

  public materialPromise: Promise<Material>;

  public material: Material;

  public ready: boolean;

  public materialArgs: { [key: string]: any } = {};

  public $mount(): void {
    const typeName = this.getValue("type");
    if (typeName) {
      this.materialPromise = (this.companion.get("MaterialFactory") as MaterialFactory).instanciate(typeName);
      this._registerAttributes();
    }
  }

  private async _registerAttributes(): Promise<void> {
    this.material = await this.materialPromise;
    const promises: Promise<any>[] = [];
    this.material.pass.forEach(p => {
      if (p instanceof SORTPass) {
        for (let key in p.programInfo.gomlAttributes) {
          this.__addAtribute(key, p.programInfo.gomlAttributes[key]);
          this.attributes.get(key).addObserver((v) => {
            this.materialArgs[key] = v.Value;
          });
          const value = this.materialArgs[key] = this.getValue(key);
          if (value instanceof ResourceBase) {
            promises.push((value as ResourceBase).validPromise);
          }
        }
      }
    });
    await Promise.all(promises);
    this.ready = true;
  }

}
