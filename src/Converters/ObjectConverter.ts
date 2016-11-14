import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";

function ObjectConverter(this: Attribute, val: any): any {
  return val;
}

export default ObjectConverter;
