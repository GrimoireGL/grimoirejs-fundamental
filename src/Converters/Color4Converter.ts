import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Color3 from "grimoirejs-math/ref/Color3";
import Color4 from "grimoirejs-math/ref/Color4";

function Color4Converter(this: Attribute, val: any): any {
  if (val instanceof Color4) {
    return val;
  } else if (val instanceof Color3) {
    return new Color4(val.R, val.G, val.B, 1.0);
  } else if (typeof val === "string") {
    return Color4.parse(val);
  } else if (Array.isArray(val)) {
    return new Color4(val[0], val[1], val[2], val[3]);
  } else {
    throw new Error(`${val} can not be parsed as Color4.`);
  }
}

export default Color4Converter;
