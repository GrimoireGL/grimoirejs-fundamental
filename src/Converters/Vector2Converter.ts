import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Vector2 from "grimoirejs-math/ref/Vector2";
function Vector2Converter(this: Attribute, val: any): any {
  if (val instanceof Vector2) {
    return val;
  } else if (typeof val === "string") {
    return Vector2.parse(val);
  } else if (typeof val === "number") {
    return new Vector2(val, val);
  } else if (Array.isArray(val)) {
    return new Vector2(val[0], val[1]);
  }
}

export default Vector2Converter;
