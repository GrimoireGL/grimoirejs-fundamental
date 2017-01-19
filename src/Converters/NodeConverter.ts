import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import Component from "grimoirejs/ref/Node/Component";

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
