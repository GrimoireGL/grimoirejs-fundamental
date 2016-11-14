import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";

function NumberConverter(this: Attribute, val: any): any {
  return Number.parseFloat(val);
}

export default NumberConverter;
