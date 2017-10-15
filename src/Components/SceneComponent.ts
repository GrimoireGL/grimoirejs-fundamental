import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import ISceneUpdateArgument from "../SceneRenderer/ISceneUpdateArgument";
import RenderQueueRegistry from "../SceneRenderer/RenderQueueRegistry";
import Timer from "../Util/Timer";

/**
 * 特定のシーン内に関連する処理を行うためのコンポーネント
 * このコンポーネントには属性が存在しません。
 */
export default class SceneComponent extends Component {
  public static componentName = "Scene";

  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  private static _sceneDescriptionCreationHandlers: ((sd: { [key: string]: any }, scene: SceneComponent) => void)[] = [];

  public static onSceneDescriptionCreation(handler: (sd: { [key: string]: any }, scene: SceneComponent) => void): void {
    SceneComponent._sceneDescriptionCreationHandlers.push(handler);
  }

  public sceneDescription: { [key: string]: any };

  public queueRegistory: RenderQueueRegistry = new RenderQueueRegistry();

  /**
   * The index of loop executed last time.
   * @type {number}
   */
  private _lastUpdateIndex: number;

  /**
   * Notify update scene only when send update message is needed.
   * @param {Timer} timer [description]
   */
  public updateScene(timer: Timer): void {
    if (this._lastUpdateIndex !== timer.frameCount) {
      const sceneUpdateInfo: ISceneUpdateArgument = {
        sceneDescription: this.sceneDescription,
        timer,
      };
      this.node.broadcastMessage("update", sceneUpdateInfo);
      this._lastUpdateIndex = timer.frameCount;
    }
  }

  protected $mount(): void {
    this.sceneDescription = {};
    SceneComponent._sceneDescriptionCreationHandlers.forEach(v => v(this.sceneDescription, this));
  }
}
