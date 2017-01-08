import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import Component from "grimoirejs/ref/Node/Component";

let _lastVal;
let _node;
function PositionConverter(this: Attribute, val: any): any {
  if (val === null) {
    return null;
  }
  if (typeof val === "string") {
    if (_lastVal === val) {
      return _node.getAttribute("position");
    } else {
      try { // TODO: remove try cache after fixed grimoirejs-math.
        let vec = Attribute.convert("Vector3", this, val);
        if (vec) {
          return vec;
        }
      } catch (e) {
        ;
      }
      _lastVal = val;
      _node = Attribute.convert("Node", this, val) as GomlNode;
      if (_node) {
        return _node.getAttribute("position");
      }
    }
  }
}

export default PositionConverter;
