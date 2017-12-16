import Attribute from "grimoirejs/ref/Core/Attribute";
import GomlNode from "grimoirejs/ref/Core/GomlNode";

export default function NodeConverter(val: any, attr: Attribute): any {
  if (val === null) {
    return null;
  }
  if (val instanceof GomlNode) {
    return val;
  } else if (typeof val === "string") {
    return attr.component.node.tree(val).first();
  }
}
