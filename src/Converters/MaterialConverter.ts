import gr from "grimoirejs";
const Attribute = gr.Node.Attribute;
import MaterialFactory from "../Material/MaterialFactory";
import MaterialComponent from "../Components/MaterialComponent";

function MaterialConverter(this: Attribute, val: any): any {
  if (typeof val === "string") {
    const regex = /\s*new\s*\(\s*([a-zA-Z\d\-]+)\s*\)/;
    let regexResult: RegExpExecArray;
    if (regexResult = regex.exec(val)) { // new material should be instanciated for this material
      this.component[this.declaration["componentBoundTo"]] = null;
      return (this.companion.get("MaterialFactory") as MaterialFactory).instanciate(regexResult[1]);
    } else {
      const mc = this.tree(val)("Material").get() as MaterialComponent;
      this.component[this.declaration["componentBoundTo"]] = mc;
      return mc.materialPromise;
    }
  }
}

export default MaterialConverter;
