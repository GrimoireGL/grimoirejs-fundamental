import {Vector3} from "grimoirejs-math";
function Vector3Converter(val: any): any {
  if (val instanceof Vector3) {
    return val;
  } else {
    return Vector3.parse(val);
  }
}

export default Vector3Converter;
