import {Color3, Color4} from "grimoirejs-math";
function Color4Converter(val: any): any {
  if (val instanceof Color4) {
    return val;
  } else if (val instanceof Color3) {
    return new Color4(val.R, val.G, val.B, 1.0);
  } else if (typeof val === "string") {
    return Color4.parse(val);
  } else {
    throw new Error(`${val} can not be parsed as Color4.`);
  }
}

export default Color4Converter;
