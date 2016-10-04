import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";

export default class SceneComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  public sceneDescription: { [key: string]: any } = {};

  /**
   * The index of loop executed last time.
   * @type {number}
   */
  private _lastUpdateIndex: number;

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
