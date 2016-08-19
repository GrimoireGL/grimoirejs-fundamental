import RotationParser from "../Util/RotationParser";

function Angle2DConverter(val: any): any {
  return RotationParser.parseAngle(val);
}

export default Angle2DConverter;
