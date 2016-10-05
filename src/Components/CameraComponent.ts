import RenderSceneArgument from "../Objects/RenderSceneArgument";
import IRenderSceneMessage from "../Messages/IRenderSceneMessage";
import TransformComponent from "./TransformComponent";
import PerspectiveCamera from "../Camera/PerspectiveCamera";
import ICamera from "../Camera/ICamera";
import GomlNode from "grimoirejs/lib/Node/GomlNode";
import SceneComponent from "./SceneComponent";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";

export default class CameraComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    fovy: {
      defaultValue: 0.3,
      converter: "Number"
    },
    near: {
      defaultValue: 0.01,
      converter: "Number"
    },
    far: {
      defaultValue: 10,
      converter: "Number"
    },
    aspect: {
      defaultValue: 1.6,
      converter: "Number"
    }
  };

  public camera: ICamera;

  public containedScene: SceneComponent;

  public transform: TransformComponent;

  /**
 * Find scene tag recursively.
 * @param  {GomlNode}       node [the node to searching currently]
 * @return {SceneComponent}      [the scene component found]
 */
  private static _findContainedScene(node: GomlNode): SceneComponent {
    if (node.parent) {
      const scene = node.parent.getComponent("Scene");
      if (scene && scene instanceof SceneComponent) {
        return scene as SceneComponent;
      } else {
        return CameraComponent._findContainedScene(node.parent);
      }
    } else {
      return null;
    }
  }

  public $awake(): void {
    this.containedScene = CameraComponent._findContainedScene(this.node);
    const c = this.camera = new PerspectiveCamera();
    this.transform = this.node.getComponent("Transform") as TransformComponent;
    this.$transformUpdated(this.transform);
    c.setFar(this.attributes.get("far").Value);
    c.setNear(this.attributes.get("near").Value);
    c.setFovy(this.attributes.get("fovy").Value);
    c.setAspect(this.attributes.get("aspect").Value);
  }

  public updateContainedScene(loopIndex: number): void {
    if (this.containedScene) {
      this.containedScene.updateScene(loopIndex);
    }
  }

  public renderScene(args: RenderSceneArgument): void {
    if (this.containedScene) {
      (args as IRenderSceneMessage).sceneDescription = this.containedScene.sceneDescription;
      this.containedScene.node.broadcastMessage("render", args as IRenderSceneMessage);
    }
  }

  public $transformUpdated(t: TransformComponent): void {
    if (this.camera) {
      this.camera.updateTransform(t);
    }
  }
}
