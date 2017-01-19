import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import Component from "grimoirejs/ref/Node/Component";

let _lastVal;
let _node;
export default function PositionConverter(val: any, attr: Attribute): any {
  if (val === null) {
    return null;
  }
  if (_lastVal === val) {
    return _node.getAttribute("position");
  } else {
    _lastVal = null;
    try { // TODO: remove try cache after fixed grimoirejs-math.
      let vec = Attribute.convert("Vector3", attr, val);
      if (vec) {
        return vec;
      }
    } catch (e) {
      ;
    }
    _node = Attribute.convert("Node", attr, val) as GomlNode;
    if (_node) {
      _lastVal = val;
      return _node.getAttribute("position");
    }
  }
}
