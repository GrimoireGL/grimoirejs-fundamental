import Component from "grimoirejs/lib/Core/Node/Component";
import GomlNode from "grimoirejs/lib/Core/Node/GomlNode";


function ComponentConverter(val: any): any {
  if (!this.declaration.target) {
    throw new Error("Component converter require to be specified target");
  }
  if (val instanceof GomlNode) {
    // TODO should be implemented
  } else if (val instanceof Component) {
    return val; // check component type?
  } else {
    return this.tree(val)(this.declaration.target).get(0, 0, 0);
  }
}

export default ComponentConverter;
