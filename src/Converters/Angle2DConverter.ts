import gr from "grimoirejs";
import RotationParser from "../Util/RotationParser";
import Attribute from "grimoirejs/ref/Node/Attribute";
function Angle2DConverter(this: Attribute, val: any): any {
  if (typeof val === "number") {
    return val;
  }
  if (typeof val === "string") {
    return RotationParser.parseAngle(val);
  }
  throw new Error(`Passed argument "${val}" can't be parsed as angle.`);
}

export default Angle2DConverter;
