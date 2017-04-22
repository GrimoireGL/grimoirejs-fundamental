import RenderQueueRegistry from "../SceneRenderer/RenderQueueRegistry";
import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Timer from "../Util/Timer";

/**
 * 特定のシーン内に関連する処理を行うためのコンポーネント
 * このコンポーネントには属性が存在しません。
 */
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
   * @param {Timer} timer [description]
   */
  public updateScene(timer: Timer): void {
    if (this._lastUpdateIndex !== timer.frameCount) {
      this.node.broadcastMessage("update", this.sceneDescription);
      this._lastUpdateIndex = timer.frameCount;
    }
  }
}
