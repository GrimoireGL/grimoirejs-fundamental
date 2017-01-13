import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import MaterialFactory from "../Material/MaterialFactory";
import MaterialComponent from "../Components/MaterialComponent";

export default function MaterialConverter(this: Attribute, val: any): any {
  if (typeof val === "string") {
    const regex = /\s*new\s*\(\s*([a-zA-Z\d\-]+)\s*\)/;
    let regexResult: RegExpExecArray;
    if (regexResult = regex.exec(val)) { // new material should be instanciated for this material
      this.component[this.declaration["componentBoundTo"]] = null;
      return (this.companion.get("MaterialFactory") as MaterialFactory).instanciate(regexResult[1]);
    } else {
      const node = this.tree(val).first();
      if(node){
        const mc = node.getComponent(MaterialComponent);
        this.component[this.declaration["componentBoundTo"]] = mc;
        return mc.materialPromise;
      }else{
        console.warn(`There was no matching material component filtered by '${val}'`);
        return null;
      }
    }
  }
  return null; // TODO ??
}
