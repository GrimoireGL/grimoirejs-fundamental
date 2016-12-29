import SceneComponent from "./SceneComponent";
import GomlNode from "grimoirejs/ref/Node/GomlNode";
import CameraComponent from "./CameraComponent";
import IRenderable from "../SceneRenderer/IRenderable";
import IRenderArgument from "../SceneRenderer/IRenderArgument";
import gr from "grimoirejs";
import MaterialContainerComponent from "./MaterialContainerComponent";
import IMaterialArgument from "../Material/IMaterialArgument";
import GeometryRegistory from "./GeometryRegistoryComponent";
import TransformComponent from "./TransformComponent";
import Geometry from "../Geometry/Geometry";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import GLM from "grimoirejs-math/ref/GLM";
const {vec3} = GLM;

export default class MeshRenderer extends Component implements IRenderable {

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
      return null;
    }
  }

  public static attributes: { [key: string]: IAttributeDeclaration } = {
    geometry: {
      converter: "Geometry",
      default: "quad"
    },
    targetBuffer: {
      converter: "String",
      default: "default"
    },
    layer: {
      converter: "String",
      default: "default"
    },
    drawCount: {
      converter: "Number",
      default: Number.MAX_VALUE
    },
    drawOffset: {
      converter: "Number",
      default: 0
    }
  };

  private _geometry: Geometry;
  private _targetBuffer: string;
  private _materialContainer: MaterialContainerComponent;
  private _transformComponent: TransformComponent;
  private _containedScene: SceneComponent;
  private _layer: string;
  private _drawOffset: number;
  private _drawCount: number;

  private _priortyCalcCache = new Float32Array(3);

  public getRenderingPriorty(camera: CameraComponent, cameraMoved: boolean, lastPriorty: number): number {
    vec3.add(this._priortyCalcCache, camera.transform.globalPosition.rawElements, this._geometry.aabb.Center.rawElements);
    vec3.sub(this._priortyCalcCache, this._priortyCalcCache, this._transformComponent.globalPosition.rawElements);
    return this._materialContainer.getDrawPriorty(vec3.sqrLen(this._priortyCalcCache)); // Obtains distance between camera and center of aabb
  }

  public $awake(): void {
    this.getAttributeRaw("targetBuffer").boundTo("_targetBuffer");
    this.getAttributeRaw("layer").boundTo("_layer");
    this.getAttributeRaw("drawOffset").boundTo("_drawOffset");
    this.getAttributeRaw("drawCount").boundTo("_drawCount");
    this.getAttributeRaw("geometry").boundTo("_geometry");
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
    if (!this.node.isActive || !this.enabled || this._layer !== args.layer) {
      return;
    }
    if (!this._geometry || (!args.material && !this._materialContainer.ready)) {
      return; // material is not instanciated yet.
    }
    const renderArgs = <IMaterialArgument>{
      targetBuffer: this._targetBuffer,
      geometry: this._geometry,
      attributeValues: null,
      camera: args.camera,
      transform: this._transformComponent,
      buffers: args.buffers,
      viewport: args.viewport,
      drawCount: this._drawCount,
      drawOffset: this._drawOffset,
      sceneDescription: args.sceneDescription,
      defaultTexture: args.defaultTexture,
      technique: args.technique
    };
    if (args.material) {
      renderArgs.attributeValues = args.materialArgs;
      args.material.draw(renderArgs);
    } else {
      renderArgs.attributeValues = this._materialContainer.materialArgs;
      this._materialContainer.material.draw(renderArgs);
    }
    this.node.emit("render", args);
  }
}
