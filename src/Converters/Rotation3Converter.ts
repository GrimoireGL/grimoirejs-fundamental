import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import RotationParser from "../Util/RotationParser";
import Quaternion from "grimoirejs-math/ref/Quaternion";
function Rotation3Converter(this: Attribute, val: any): any {
  if (val instanceof Quaternion) {
    return val;
  } else if (Array.isArray(val)) {
    return new Quaternion([val[0], val[1], val[2], val[3]]);
  }
  return RotationParser.parseRotation3D(val);
}

export default Rotation3Converter;
