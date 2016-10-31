import RenderSceneArgument from "../Objects/RenderSceneArgument";
import IRenderMesssage from "../Messages/IRenderMessage";
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
    },
    autoAspect: {
      defaultValue: true,
      converter: "Boolean"
    }
  };

  public camera: ICamera;

  public containedScene: SceneComponent;

  public transform: TransformComponent;

  private _autoAspect: boolean;

  private _aspectCache: number;

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
    this.getAttribute("far").addObserver((v) => {
      c.setFar(v.Value);
    }, true);
    this.getAttribute("near").addObserver((v) => {
      c.setNear(v.Value);
    }, true);
    this.getAttribute("fovy").addObserver((v) => {
      c.setFovy(v.Value);
    }, true);
    this.getAttribute("aspect").addObserver((v) => {
      c.setAspect(v.Value);
    }, true);
    this.getAttribute("autoAspect").boundTo("_autoAspect");
  }

  public updateContainedScene(loopIndex: number): void {
    if (this.containedScene) {
      this.containedScene.updateScene(loopIndex);
    }
  }

  public renderScene(args: RenderSceneArgument): void {
    if (this.containedScene) {
      this._justifyAspect(args);
      (args as IRenderMesssage).sceneDescription = this.containedScene.sceneDescription;
      (args as IRenderMesssage).defaultTexture = this.companion.get("defaultTexture");
      this.containedScene.node.broadcastMessage("render", args as IRenderMesssage);
    }
  }

  public $transformUpdated(t: TransformComponent): void {
    if (this.camera) {
      this.camera.updateTransform(t);
    }
  }

  private _justifyAspect(args: RenderSceneArgument): void {
    if (this._autoAspect) {
      const asp = args.viewport.Width / args.viewport.Height;
      if (this._aspectCache !== asp) {
        this.setValue("aspect", asp);
        this._aspectCache = asp;
      }
    }
  }
}
