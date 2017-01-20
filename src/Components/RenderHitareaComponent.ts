import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import RenderSceneComponent from "./RenderSceneComponent";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Component from "grimoirejs/ref/Node/Component";
export default class RenderHitareaComponent extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {

    };

    private _sceneRenderer:RenderSceneComponent;

    public $mount():void{
      this._sceneRenderer = this.node.getComponent(RenderSceneComponent);
      if(!this._sceneRenderer){
        throw new Error("The node attaching RenderHitArea should contain RenderScene.")
      }
    }

    public $resizeBuffer(args: IResizeBufferMessage): void {

    }

    public render():void{

    }
}
