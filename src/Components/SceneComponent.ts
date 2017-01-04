import RenderQueueRegistry from "../SceneRenderer/RenderQueueRegistry";
import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

export default class SceneComponent extends Component {

  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  public sceneDescription: { [key: string]: any };

  public queueRegistory: RenderQueueRegistry = new RenderQueueRegistry();

  /**
   * The index of loop executed last time.
   * @type {number}
   */
  private _lastUpdateIndex: number;

  private static _sceneDescriptionCreationHandlers:((sd:{[key:string]:any},scene:SceneComponent)=>void)[] = [];

  public static onSceneDescriptionCreation(handler:(sd:{[key:string]:any},scene:SceneComponent)=>void):void{
    SceneComponent._sceneDescriptionCreationHandlers.push(handler);
  }

  public $mount():void{
    this.sceneDescription = {};
    SceneComponent._sceneDescriptionCreationHandlers.forEach(v=>v(this.sceneDescription,this));
  }

  /**
   * Notify update scene only when send update message is needed.
   * @param {number} loopIndex [description]
   */
  public updateScene(loopIndex: number): void {
    if (this._lastUpdateIndex !== loopIndex) {
      this.node.broadcastMessage("update", this.sceneDescription);
      this._lastUpdateIndex = loopIndex;
    }
  }
}
