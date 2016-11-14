import gr from "grimoirejs";
import RotationParser from "../Util/RotationParser";
import Attribute from "grimoirejs/ref/Node/Attribute";
function Angle2DConverter(this: Attribute, val: any): any {
  return RotationParser.parseAngle(val);
}

export default Angle2DConverter;
