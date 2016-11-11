import gr from "grimoirejs";
const Attribute = gr.Node.Attribute;
import RotationParser from "../Util/RotationParser";

function Angle2DConverter(this: Attribute, val: any): any {
  return RotationParser.parseAngle(val);
}

export default Angle2DConverter;
