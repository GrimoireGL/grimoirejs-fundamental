import Attribute from "grimoirejs/lib/Node/Attribute";

function ObjectConverter(this: Attribute, val: any): any {
  return val;
}

export default ObjectConverter;
