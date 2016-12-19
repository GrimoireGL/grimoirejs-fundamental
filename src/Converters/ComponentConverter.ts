import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Component from "grimoirejs/ref/Node/Component";
import GomlNode from "grimoirejs/ref/Node/GomlNode";


function ComponentConverter(this: Attribute, val: any): any {
  if (!this.declaration["target"]) {
    throw new Error("Component converter require to be specified target");
  }
  if (val === null) {
    return null;
  }
  if (val instanceof GomlNode) {
    return (val as GomlNode).getComponent(this.declaration["target"]);
  } else if (val instanceof Component) {
    if ((val as Component).name === this.declaration["target"]) {
      return val; // check component type?
    } else {
      throw new Error(`Specified component must be ${this.declaration["target"]}`);
    }
  } else {
    const n = this.tree(val).first();
    if (n) {
      return n.getComponent(this.declaration["target"]);
    }
    return null;
  }
}

export default ComponentConverter;
