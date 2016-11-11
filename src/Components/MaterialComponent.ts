import gr from "grimoirejs";
import MaterialFactory from "../Material/MaterialFactory";
import SORTPass from "../Material/SORTPass";
import Material from "../Material/Material";
const Component = gr.Node.Component;
const IAttributeDeclaration = gr.Node.IAttributeDeclaration;
import ResourceBase from "../Resource/ResourceBase";


export default class MaterialComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    type: {
      converter: "String",
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
        const cp: SORTPass = p as SORTPass;
        for (let key in cp.sort.gomlAttributes) {
          this.__addAtribute(key, cp.sort.gomlAttributes[key]);
          this.attributes.get(key).addObserver((v) => {
            this.materialArgs[key] = v.Value;
          });
          const value = this.materialArgs[key] = this.getValue(key);
          if (value instanceof ResourceBase) {
            promises.push((value as ResourceBase).validPromise);
          }
        }
        for (let macro of cp.sort.macros) {
          switch (macro.type) {
            case "int": // should use integer converter
              this.__addAtribute(macro.attributeName, {
                converter: "Number",
                defaultValue: macro.default
              });
              this.getAttribute(macro.attributeName).addObserver(
                (v) => {
                  cp.setMacro(macro.macroName, "" + Math.floor(v.Value));
                }, true);
              return;
            case "bool": // should use integer converter
              this.__addAtribute(macro.attributeName, {
                converter: "Boolean",
                defaultValue: macro.default
              });
              this.getAttribute(macro.attributeName).addObserver(
                (v) => {
                  cp.setMacro(macro.macroName, v.Value);
                }, true);
              return;
            default:
              throw new Error(`Unexpected macro type ${macro.type}`);
          }
        }
      }
    });
    await Promise.all(promises);
    this.ready = true;
  }

}
