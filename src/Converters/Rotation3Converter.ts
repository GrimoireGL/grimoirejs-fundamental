import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import RotationParser from "../Util/RotationParser";
import {Quaternion} from "grimoirejs-math";
function Rotation3Converter(this: Attribute, val: any): any {
  if (val instanceof Quaternion) {
    return val;
  }
  return RotationParser.parseRotation3D(val);
}

export default Rotation3Converter;
