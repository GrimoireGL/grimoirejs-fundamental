import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Vector3 from "grimoirejs-math/ref/Vector3";
function Vector3Converter(this: Attribute, val: any): any {
  if (val instanceof Vector3) {
    return val;
  } else {
    return Vector3.parse(val);
  }
}

export default Vector3Converter;
