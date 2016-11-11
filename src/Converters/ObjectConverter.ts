import gr from "grimoirejs";
const Attribute = gr.Node.Attribute;

function ObjectConverter(this: Attribute, val: any): any {
  return val;
}

export default ObjectConverter;
