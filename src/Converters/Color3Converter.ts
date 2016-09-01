import {Color3, Color4} from "grimoirejs-math";
function Color3Converter(val: any): any {
  if (val instanceof Color3) {
    return val;
  } else if (val instanceof Color4) {
    return new Color3(val.R, val.G, val.B);
  } else if (typeof val === "string") {
    return Color3.parse(val);
  } else {
    throw new Error(`${val} can not be parsed as Color4.`);
  }
}

export default Color3Converter;
