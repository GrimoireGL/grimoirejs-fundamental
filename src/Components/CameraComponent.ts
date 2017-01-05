import GLM from "grimoirejs-math/ref/GLM";
const {vec3, vec4, mat4} = GLM;
import Vector4 from "grimoirejs-math/ref/Vector4";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Matrix from "grimoirejs-math/ref/Matrix";
import RenderQueue from "../SceneRenderer/RenderQueue";
import IRenderArgument from "../SceneRenderer/IRenderArgument";
import gr from "grimoirejs";
import RenderSceneArgument from "../Objects/RenderSceneArgument";
import TransformComponent from "./TransformComponent";
import SceneComponent from "./SceneComponent";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

export default class CameraComponent extends Component {
  private static _frontOrigin: Vector4 = new Vector4(0, 0, -1, 0);
  private static _upOrigin: Vector4 = new Vector4(0, 1, 0, 0);

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

  public containedScene: SceneComponent;

  public transform: TransformComponent;

  private _autoAspect: boolean;

  private _aspectCache: number;

  private _renderQueue: RenderQueue = new RenderQueue();

  private _eyeCache: Vector3 = Vector3.Zero;
  private _lookAtCache: Vector3 = Vector3.Zero;
  private _upCache: Vector3 = Vector3.Zero;
  protected __viewMatrix: Matrix = new Matrix();
  protected __projectionMatrix: Matrix = new Matrix();
  protected __invProjectionMatrix: Matrix = new Matrix();
  protected __projectionViewMatrix: Matrix = new Matrix();
  private _far: number;
  private _near: number;
  private _fovy: number;
  private _orthoSize: number;
  private _aspect: number;
  private _orthographic: boolean = false;

  public get ViewMatrix(): Matrix {
    return this.__viewMatrix;
  }
  public get ProjectionMatrix(): Matrix {
    return this.__projectionMatrix;
  }
  public get InvProjectionMatrix(): Matrix {
    return this.__invProjectionMatrix;
  }
  public get ProjectionViewMatrix(): Matrix {
    return this.__projectionViewMatrix;
  }
  public get Far(): number {
    return this._far;
  }
  public set Far(far: number) {
    this._far = far;
    this._recalculateProjection();
  }
  public get Near(): number {
    return this._near;
  }
  public set Near(near: number) {
    this._near = near;
    this._recalculateProjection();
  }
  public get Aspect(): number {
    return this._aspect;
  }
  public set Aspect(aspect: number) {
    this._aspect = aspect;
    this._recalculateProjection();
  }
  public get Fovy(): number {
    return this._fovy;
  }

  public set Fovy(fov: number) {
    this._fovy = fov;
    this._recalculateProjection();
  }

  public get OrthoSize(): number {
    return this._orthoSize;
  }

  public set OrthoSize(size: number) {
    this._orthoSize = size;
  }

  public set OrthographicMode(isOrtho: boolean) {
    this._orthographic = isOrtho;
    this._recalculateProjection();
  }

  public get OrthographicMode(): boolean {
    return this._orthographic;
  }

  public set AutoAspect(autoMode:boolean){
    if(this._autoAspect !== autoMode){
      this._autoAspect = autoMode;
      this._recalculateProjection();
    }
  }

  public get AutoAspect():boolean{
    return this._autoAspect;
  }

  /**
 * Find scene tag recursively.
 * @param  {GomlNode}       node [the node to searching currently]
 * @return {SceneComponent}      [the scene component found]
 */
  private static _findContainedScene(node: GomlNode): SceneComponent {
    if (node.parent) {
      const scene = node.parent.getComponent(SceneComponent);
      if (scene) {
        return scene;
      } else {
        return CameraComponent._findContainedScene(node.parent);
      }
    } else {
      return null;
    }
  }


  public $awake(): void {
    this.transform = this.node.getComponent(TransformComponent);
    this.updateTransform();
    this.getAttributeRaw("far").watch((v) => {
      this.Far = v;
    }, true);
    this.getAttributeRaw("near").watch((v) => {
      this.Near = v;
    }, true);
    this.getAttributeRaw("fovy").watch((v) => {
      this.Fovy = v;
    }, true);
    this.getAttributeRaw("aspect").watch((v) => {
      this.Aspect = v;
    }, true);
    this.getAttributeRaw("orthoSize").watch((v) => {
      this.OrthoSize = v;
    }, true);
    this.getAttributeRaw("orthogonal").watch((v) => {
      this.OrthographicMode = v;
    }, true);
    this.getAttributeRaw("autoAspect").boundTo("_autoAspect");
  }


  public $mount(): void {
    this.containedScene = CameraComponent._findContainedScene(this.node);
    this.containedScene.queueRegistory.registerQueue(this._renderQueue);
    this.node.on("transformUpdated", this.updateTransform.bind(this));
    this.updateTransform();
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
    args = args as IRenderArgument;
    if (this.containedScene) {
      this._justifyAspect(args);
      (args as IRenderArgument).sceneDescription = this.containedScene.sceneDescription;
      this._renderQueue.renderAll(args as IRenderArgument, true, args.loopIndex);
    }
  }

  private _justifyAspect(args: RenderSceneArgument): void {
    if (this._autoAspect) {
      const asp = args.viewport.Width / args.viewport.Height;
      if (this._aspectCache !== asp) { // Detect changing viewport size
        this.setAttribute("aspect", asp);
        this._aspectCache = asp;
      }
    }
  }

  public updateTransform(): void {
    const transform = this.transform;
    vec3.transformMat4(this._eyeCache.rawElements, Vector3.Zero.rawElements, transform.globalTransform.rawElements);
    vec4.transformMat4(this._lookAtCache.rawElements, CameraComponent._frontOrigin.rawElements, transform.globalTransform.rawElements);
    vec3.add(this._lookAtCache.rawElements, this._lookAtCache.rawElements, this._eyeCache.rawElements);
    vec4.transformMat4(this._upCache.rawElements, CameraComponent._upOrigin.rawElements, transform.globalTransform.rawElements);
    mat4.lookAt(this.__viewMatrix.rawElements, this._eyeCache.rawElements, this._lookAtCache.rawElements, this._upCache.rawElements);
    mat4.mul(this.__projectionViewMatrix.rawElements, this.__projectionMatrix.rawElements, this.__viewMatrix.rawElements);
  }

  private _recalculateProjection(): void {
    if (!this._orthographic) {
      mat4.perspective(this.__projectionMatrix.rawElements, this._fovy, this._aspect, this._near, this._far);
    } else {
      mat4.ortho(this.__projectionMatrix.rawElements, -this._orthoSize * this._aspect, this._orthoSize * this._aspect, -this._orthoSize, this._orthoSize, this._near, this._far);
    }
    mat4.mul(this.__projectionViewMatrix.rawElements, this.__projectionMatrix.rawElements, this.__viewMatrix.rawElements);
    mat4.invert(this.__invProjectionMatrix.rawElements, this.__projectionMatrix.rawElements);
  }
}
