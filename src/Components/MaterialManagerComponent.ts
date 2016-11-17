import gr from "grimoirejs";
import MaterialFactory from "../Material/MaterialFactory";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
export default class MaterialManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  public $awake(): void {
    const ns = gr.ns(this.name.ns);
    this.companion.set(ns("MaterialFactory"), new MaterialFactory(this.companion.get("gl")));
  }
}
