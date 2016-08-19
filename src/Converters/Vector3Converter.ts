import Vector3 from "grimoirejs/lib/Core/Math/Vector3";
function Vector3Converter(val: any): any {
  if (val instanceof Vector3) {
    return val;
  } else {
    return Vector3.parse(val);
  }
}

export default Vector3Converter;
