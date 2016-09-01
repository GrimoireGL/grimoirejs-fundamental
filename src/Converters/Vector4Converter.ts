import {Vector4} from "grimoirejs-math";
function Vector4Converter(val: any): any {
  if (val instanceof Vector4) {
    return val;
  } else {
    return Vector4.parse(val);
  }
}

export default Vector4Converter;
