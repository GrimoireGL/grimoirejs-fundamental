import Attribute from "grimoirejs/lib/Node/Attribute";

function NumberConverter(this: Attribute, val: any): any {
  return Number.parseFloat(val);
}

export default NumberConverter;
