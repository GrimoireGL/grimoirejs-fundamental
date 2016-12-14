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
      default: "45d",
      converter: "Angle2D"
    },
    near: {
      default: 0.01,
      converter: "Number"
    },
    far: {
      default: 100,
      converter: "Number"
    },
    aspect: {
      default: 1.6,
      converter: "Number"
    },
    autoAspect: {
      default: true,
      converter: "Boolean"
    },
    orthoSize: {
      default: 100,
      converter: "Number"
    },
    orthogonal: {
      default: false,
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
    this.transform = this.node.getComponent(TransformComponent);
    this.$transformUpdated(this.transform);
    this.getAttributeRaw("far").watch((v) => {
      c.setFar(v);
    }, true);
    this.getAttributeRaw("near").watch((v) => {
      c.setNear(v);
    }, true);
    this.getAttributeRaw("fovy").watch((v) => {
      c.setFovy(v);
    }, true);
    this.getAttributeRaw("aspect").watch((v) => {
      c.setAspect(v);
    }, true);
    this.getAttributeRaw("orthoSize").watch((v) => {
      c.setOrthoSize(v);
    }, true);
    this.getAttributeRaw("orthogonal").watch((v) => {
      c.setOrthographicMode(v);
    }, true);
    this.getAttributeRaw("autoAspect").boundTo("_autoAspect");
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
        this.setAttribute("aspect", asp);
        this._aspectCache = asp;
      }
    }
  }
}
