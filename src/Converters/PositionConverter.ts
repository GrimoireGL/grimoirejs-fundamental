import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import Component from "grimoirejs/ref/Node/Component";

let _lastVal;
let _node;


export default {
  name: "Position",
  lazy: true,
  verify: function(attr: Attribute) {
    return true;
  },
  convert: function(val: any, attr: Attribute) {
    if (val === null) {
      return null;
    }
    if (attr.convertContext._lastVal === val) {
      return attr.convertContext._node.getAttribute("position");
    } else {
      attr.convertContext._lastVal = null;
      try { // TODO: remove try cache after fixed grimoirejs-math.
        let vec = Attribute.convert("Vector3", attr, val);
        if (vec) {
          return vec;
        }
      } catch (e) {
        ;
      }
      attr.convertContext._node = Attribute.convert("Node", attr, val) as GomlNode;
      if (attr.convertContext._node) {
        attr.convertContext._lastVal = val;
        return attr.convertContext._node.getAttribute("position");
      }
    }
  }
};
