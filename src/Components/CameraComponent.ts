import RendererComponent from "./RendererComponent";
import GomlNode from "grimoirejs/lib/Core/Node/GomlNode";
import SceneComponent from "./SceneComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

export default class CameraComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    // Specify the attributes user can intaract
  };

  private containedScene: SceneComponent;

  public $awake(): void {
    this.containedScene = CameraComponent._findContainedScene(this.node);
  }

  public $renderScene(renderer: RendererComponent): void {
    if (this.containedScene) {
      this.containedScene.node.broadcastMessage("update");
      this.containedScene.node.broadcastMessage("render", { renderer: renderer, camera: this });
    }
  }

  private static _findContainedScene(node: GomlNode): SceneComponent {
    if (node.parent) {
      const scene = node.parent.getComponent("Scene");
      if (!scene) {
        return CameraComponent._findContainedScene(node.parent);
      } else {
        return scene;
      }
    } else {
      return null;
    }
  }
}
