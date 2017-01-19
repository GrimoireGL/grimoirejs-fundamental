import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import MaterialFactory from "../Material/MaterialFactory";
import MaterialComponent from "../Components/MaterialComponent";

export default function MaterialConverter(val: any, attr: Attribute): any {
  if (typeof val === "string") {
    const regex = /\s*new\s*\(\s*([a-zA-Z\d\-]+)\s*\)/;
    let regexResult: RegExpExecArray;
    if (regexResult = regex.exec(val)) { // new material should be instanciated for this material
      attr.component[attr.declaration["componentBoundTo"]] = null;
      return (attr.companion.get("MaterialFactory") as MaterialFactory).instanciate(regexResult[1]);
    } else {
      const node = attr.tree(val).first();
      if (node) {
        const mc = node.getComponent(MaterialComponent);
        attr.component[attr.declaration["componentBoundTo"]] = mc;
        return mc.materialPromise;
      } else {
        console.warn(`There was no matching material component filtered by '${val}'`);
        return null;
      }
    }
  }
  return null; // TODO ??
}
