import MeshRenderer from "./MeshRendererComponent";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Component from "grimoirejs/ref/Node/Component";
export default class ClickableMeshComponent extends Component{
  public static attributes:{[key:string]:IAttributeDeclaration} = {

  };

  private _meshRenderer:MeshRenderer;

  public $mount():void{
    this._meshRenderer = this.node.getComponent(MeshRenderer);
    if(!this._meshRenderer){
      throw new Error("ClickableMeshComponent must be attached with MeshRenderer");
    }
  }

  public render():void{
  }

  public onclick():void{

  }
}
