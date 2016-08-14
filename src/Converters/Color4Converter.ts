import Color4 from "grimoirejs/lib/Core/Math/Color4";
function Color4Converter(val: any): any {
  if (val instanceof Color4) {
    return val;
  }
  return Color4.parse(val);
}

export default Color4Converter;
