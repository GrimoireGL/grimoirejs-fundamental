import gr from "grimoirejs";
import MaterialFactory from "../Material/MaterialFactory";
const Component = gr.Node.Component;
const IAttributeDeclaration = gr.Node.IAttributeDeclaration;
import gr from "grimoirejs";
export default class MaterialManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  public $awake(): void {
    const ns = gr.ns(this.name.ns);
    this.companion.set(ns("MaterialFactory"), new MaterialFactory(this.companion.get("gl")));
  }
}
