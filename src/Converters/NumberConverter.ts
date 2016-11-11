import gr from "grimoirejs";
const Attribute = gr.Node.Attribute;

function NumberConverter(this: Attribute, val: any): any {
  return Number.parseFloat(val);
}

export default NumberConverter;
