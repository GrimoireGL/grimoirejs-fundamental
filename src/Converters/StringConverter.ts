import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";

function StringConverter(this: Attribute, val: any): any {
  if (typeof val === "string") {
    return val;
  } else if (typeof val === "undefined") {
    return val;
  } else if (val === null) {
    return val;
  } else if (typeof val.toString === "function") {
    return val.toString();
  }
}

export default StringConverter;
