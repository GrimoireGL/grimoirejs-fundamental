import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Vector4 from "grimoirejs-math/ref/Vector4";
function Vector4Converter(this: Attribute, val: any): any {
  if (val instanceof Vector4) {
    return val;
  } else {
    return Vector4.parse(val);
  }
}

export default Vector4Converter;
