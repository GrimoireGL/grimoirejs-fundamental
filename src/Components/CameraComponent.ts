import IRenderSceneMessage from "../Messages/IRenderSceneMessage";
import TransformComponent from "./TransformComponent";
import PerspectiveCamera from "../Camera/PerspectiveCamera";
import ICamera from "../Camera/ICamera";
import GomlNode from "grimoirejs/lib/Core/Node/GomlNode";
import SceneComponent from "./SceneComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

export default class CameraComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    fovy: {
      defaultValue: 0.3,
      converter: "number"
    },
    near: {
      defaultValue: 0.01,
      converter: "number"
    },
    far: {
      defaultValue: 10,
      converter: "number"
    },
    aspect: {
      defaultValue: 1.6,
      converter: "number"
    }
  };

  public camera: ICamera;

  public containedScene: SceneComponent;

  public $awake(): void {
    this.containedScene = CameraComponent._findContainedScene(this.node);
    const c = this.camera = new PerspectiveCamera();
    const t = this.node.getComponent("Transform") as TransformComponent;
    this.$transformUpdated(t);
    c.setFar(this.attributes.get("far").Value);
    c.setNear(this.attributes.get("near").Value);
    c.setFovy(this.attributes.get("fovy").Value);
    c.setAspect(this.attributes.get("aspect").Value);
  }

  public $renderScene(args: IRenderSceneMessage): void {
    if (this.containedScene) {
      this.containedScene.node.broadcastMessage("update");
      this.containedScene.node.broadcastMessage("render", { camera: this, buffers: args.buffers, layer: args.layer });
    }
  }

  public $transformUpdated(t: TransformComponent) {
    if (this.camera) {
      this.camera.updateTransform(t);
    }
  }

  /**
   * Find scene tag recursively.
   * @param  {GomlNode}       node [the node to searching currently]
   * @return {SceneComponent}      [the scene component found]
   */
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
