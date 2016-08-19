import RotationParser from "../Util/RotationParser";
import Quaternion from "grimoirejs/lib/Core/Math/Quaternion";
function Rotation3Converter(val: any): any {
  if (val instanceof Quaternion) {
    return val;
  }
  return RotationParser.parseRotation3D(val);
}

export default Rotation3Converter;
