import SceneComponent from "./SceneComponent";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import CameraComponent from "./CameraComponent";
import IRenderable from "../SceneRenderer/IRenderable";
import IRenderArgument from "../SceneRenderer/IRenderArgument";
import MaterialContainerComponent from "./MaterialContainerComponent";
import IMaterialArgument from "../Material/IMaterialArgument";
import TransformComponent from "./TransformComponent";
import Geometry from "../Geometry/Geometry";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import GLM from "grimoirejs-math/ref/GLM";
const { vec3 } = GLM;

/**
 * シーン中に存在するメッシュ一つあたりのレンダリングを司るコンポーネント
 * このメッシュが、対象となるノードの`Transform`や描画に用いる`Camera`、マテリアルなどを考慮して実際のレンダリングを行います。
 */
export default class MeshRenderer extends Component implements IRenderable {


  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * 描画に用いる形状データ
     */
    geometry: {
      converter: "Geometry",
      default: "quad"
    },
    /**
     * 描画に用いるインデックスバッファ名
     */
    targetBuffer: {
      converter: "String",
      default: "default"
    },
    /**
     * このメッシュが属するレイヤー
     *
     * 詳しくは`render-scene`ノードを参考にしてください。
     */
    layer: {
      converter: "String",
      default: "default"
    },
    /**
     * 描画するインデックスの個数
     *
     * デフォルトの状態でジオメトリの全インデックスを描画する
     */
    drawCount: {
      converter: "Number",
      default: Number.MAX_VALUE
    },
    /**
     * 描画するジオメトリのインデックスのオフセット
     */
    drawOffset: {
      converter: "Number",
      default: 0
    }
  };


  public index: number;
  public renderArgs: { [key: string]: any } = {};
  private geometry: Promise<Geometry>;
  private geometryInstance: Geometry;
  private targetBuffer: string;
  private layer: string;
  private drawOffset: number;
  private drawCount: number;
  private _materialContainer: MaterialContainerComponent;
  private _transformComponent: TransformComponent;
  private _containedScene: SceneComponent;

  private _priortyCalcCache = new Float32Array(3);

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
        return MeshRenderer._findContainedScene(node.parent);
      }
    } else {
      throw new Error(`scene not found: CameraComponent needs SceneComponent in ancestor.`);
    }
  }

  public getRenderingPriorty(camera: CameraComponent, cameraMoved: boolean, lastPriorty: number): number {
    if (!this.geometryInstance) {
      return Number.NEGATIVE_INFINITY;
    }
    vec3.add(this._priortyCalcCache, camera.transform.globalPosition.rawElements, this.geometryInstance.aabb.Center.rawElements);
    vec3.sub(this._priortyCalcCache, this._priortyCalcCache, this._transformComponent.globalPosition.rawElements);
    return this._materialContainer.getDrawPriorty(vec3.sqrLen(this._priortyCalcCache)); // Obtains distance between camera and center of aabb
  }

  public $awake(): void {
    this.__bindAttributes();
    this.getAttributeRaw("geometry").watch(async () => {
      this.geometryInstance = await this.geometry;
    }, true);
  }

  public $mount(): void {
    this._transformComponent = this.node.getComponent(TransformComponent);
    this._materialContainer = this.node.getComponent(MaterialContainerComponent);
    this._containedScene = MeshRenderer._findContainedScene(this.node);
    this._containedScene.queueRegistory.addRenderable(this);
  }

  public $unmount(): void {
    this._containedScene.queueRegistory.removeRenderable(this);
  }

  public render(args: IRenderArgument): void {
    if (!this.node.isActive || !this.enabled || this.layer !== args.layer) {
      return;
    }
    if (!this.geometryInstance || (!args.material && !this._materialContainer.material)) {
      return; // material is not instanciated yet.
    }
    const renderArgs: IMaterialArgument = {
      targetBuffer: this.targetBuffer,
      geometry: this.geometryInstance,
      attributeValues: null,
      camera: args.camera,
      transform: this._transformComponent,
      buffers: args.buffers,
      viewport: args.viewport,
      drawCount: this.drawCount,
      drawOffset: this.drawOffset,
      sceneDescription: args.sceneDescription,
      technique: args.technique,
      renderable: this
    };
    renderArgs.attributeValues = this._materialContainer.materialArgs; // TODO should be deprecated
    this._materialContainer.material.draw(renderArgs);
    this.node.emit("render", args);
  }

  public setRenderableIndex(index: number): void {
    this.index = index;
  }
}
