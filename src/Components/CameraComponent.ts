import RenderQueue from "../SceneRenderer/RenderQueue";
import IRenderArgument from "../SceneRenderer/IRenderArgument";
import gr from "grimoirejs";
import RenderSceneArgument from "../Objects/RenderSceneArgument";
import TransformComponent from "./TransformComponent";
import BasicCamera from "../Camera/BasicCamera";
import ICamera from "../Camera/ICamera";
import SceneComponent from "./SceneComponent";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

export default class CameraComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    fovy: {
      defaultValue: "45d",
      converter: "Angle2D"
    },
    near: {
      defaultValue: 0.01,
      converter: "Number"
    },
    far: {
      defaultValue: 100,
      converter: "Number"
    },
    aspect: {
      defaultValue: 1.6,
      converter: "Number"
    },
    autoAspect: {
      defaultValue: true,
      converter: "Boolean"
    },
    orthoSize: {
      defaultValue: 100,
      converter: "Number"
    },
    orthogonal: {
      defaultValue: false,
      converter: "Boolean"
    }
  };

  public camera: ICamera;

  public containedScene: SceneComponent;

  public transform: TransformComponent;

  private _autoAspect: boolean;

  private _aspectCache: number;

  private _renderQueue: RenderQueue = new RenderQueue();

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
    const c = this.camera = new BasicCamera();
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
    this.getAttribute("orthoSize").addObserver((v) => {
      c.setOrthoSize(v.Value);
    }, true);
    this.getAttribute("orthogonal").addObserver((v) => {
      c.setOrthographicMode(v.Value);
    }, true);
    this.getAttribute("autoAspect").boundTo("_autoAspect");
  }

  public $mount(): void {
    this.containedScene = CameraComponent._findContainedScene(this.node);
    this.containedScene.queueRegistory.registerQueue(this._renderQueue);
  }

  public $unmount(): void {
    this.containedScene.queueRegistory.unregisterQueue(this._renderQueue);
    this.containedScene = null;
  }

  public updateContainedScene(loopIndex: number): void {
    if (this.containedScene) {
      this.containedScene.updateScene(loopIndex);
    }
  }

  public renderScene(args: RenderSceneArgument): void {
    if (this.containedScene) {
      this._justifyAspect(args);
      (args as IRenderArgument).sceneDescription = this.containedScene.sceneDescription;
      (args as IRenderArgument).defaultTexture = this.companion.get("defaultTexture");
      this._renderQueue.renderAll(args as IRenderArgument, true, args.loopIndex);
      this.node.broadcastMessage("render", args as IRenderArgument);
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
