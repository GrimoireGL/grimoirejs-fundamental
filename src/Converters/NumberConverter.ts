import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";

function NumberConverter(this: Attribute, val: any): number {
  if (typeof val === "number") {
    return val;
  } else if (typeof val === "string") {
    return Number.parseFloat(val);
  }
  throw new Error("Unsupported input to convert into number!");
}

export default NumberConverter;
