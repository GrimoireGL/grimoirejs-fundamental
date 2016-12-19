import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Vector3 from "grimoirejs-math/ref/Vector3";
function Vector3Converter(this: Attribute, val: any): any {
  if (val instanceof Vector3) {
    return val;
  } else if (typeof val === "string") {
    return Vector3.parse(val);
  } else if (typeof val == "number") {
    return new Vector3(val, val, val);
  } else if (Array.isArray(val)) {
    return new Vector3(val[0], val[1], val[2]);
  }
}

export default Vector3Converter;
