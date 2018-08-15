import { Attribute } from "grimoirejs/ref/Core/Attribute";
import GomlNode from "grimoirejs/ref/Core/GomlNode";
import { Undef } from "grimoirejs/ref/Tool/Types";

export const NodeConverter = {
  name: "Node",
  convert(val: any, attr: Attribute): Undef<GomlNode> {
    if (val === null) {
      return null;
    }
    if (val instanceof GomlNode) {
      return val;
    } else if (typeof val === "string") {
      return attr.component.node.tree(val).first();
    }
  }
}

export default NodeConverter;