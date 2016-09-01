import MaterialFactory from "../Material/MaterialFactory";
import GLSLXPass from "../Material/GLSLXPass";
import Material from "../Material/Material";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";


export default class MaterialComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    type: {
      converter: "string",
      defaultValue: undefined
    }
  };

  public material: Material;

  public materialArgs: { [key: string]: any } = {};

  public $mount(): void {
    const typeName = this.getValue("type");
    if (typeName) {
      this.material = (this.companion.get("MaterialFactory") as MaterialFactory).instanciate(typeName);
      this._registerAttributes();
    }
  }

  private async _registerAttributes(): Promise<void> {
    await this.material.initializePromise;
    this.material.pass.forEach(p => {
      if (p instanceof GLSLXPass) {
        for (let key in p.programInfo.gomlAttributes) {
          this.__addAtribute(key, p.programInfo.gomlAttributes[key]);
          this.attributes.get(key).addObserver((v) => {
            this.materialArgs[key] = v.Value;
          });
          this.materialArgs[key] = this.getValue(key);
        }
      }
    });
  }

}
