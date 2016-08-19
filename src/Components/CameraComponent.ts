import TransformComponent from "./TransformComponent";
import PerspectiveCamera from "../Camera/PerspectiveCamera";
import ICamera from "../Camera/ICamera";
import RendererComponent from "./RendererComponent";
import GomlNode from "grimoirejs/lib/Core/Node/GomlNode";
import SceneComponent from "./SceneComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

export default class CameraComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    fovy: {
      defaultValue: "45d",
      converter: "angle2d"
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

  private camera: ICamera;

  private containedScene: SceneComponent;

  public $awake(): void {
    this.containedScene = CameraComponent._findContainedScene(this.node);
    const c = this.camera = new PerspectiveCamera();
    const t = this.node.getComponent("Transform") as TransformComponent;
    t.addObserver(this._updateViewMatrix);
    this._updateViewMatrix(t);
    this.camera.setFar(this.attributes.get("far").Value);
    this.camera.setNear(this.attributes.get("near").Value);
    c.setFovy(this.attributes.get("fovy").Value);
    c.setAspect(this.attributes.get("aspect").Value);
  }

  public $renderScene(renderer: RendererComponent): void {
    if (this.containedScene) {
      this.containedScene.node.broadcastMessage("update");
      this.containedScene.node.broadcastMessage("render", { renderer: renderer, camera: this });
    }
  }

  private _updateViewMatrix(t: TransformComponent): void {
    this.camera.updateTransform(t);
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
