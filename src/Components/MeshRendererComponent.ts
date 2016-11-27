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


export default class MeshRenderer extends Component implements IRenderable {

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
        return MeshRenderer._findContainedScene(node.parent);
      }
    } else {
      return null;
    }
  }

  public static attributes: { [key: string]: IAttributeDeclaration } = {
    geometry: {
      converter: "Geometry",
      defaultValue: "quad"
    },
    targetBuffer: {
      converter: "String",
      defaultValue: "default"
    },
    layer: {
      converter: "String",
      defaultValue: "default"
    },
    drawCount: {
      converter: "Number",
      defaultValue: Number.MAX_VALUE
    },
    drawOffset: {
      converter: "Number",
      defaultValue: 0
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

  public getRenderingPriorty(camera: CameraComponent, cameraMoved: boolean, lastPriorty: number): number {
    return 10000 - camera.transform.globalPosition.subtractWith(this._transformComponent.globalPosition).magnitude;
  }

  public $awake(): void {
    this.getAttribute("targetBuffer").boundTo("_targetBuffer");
    this.getAttribute("layer").boundTo("_layer");
    this.getAttribute("drawOffset").boundTo("_drawOffset");
    this.getAttribute("drawCount").boundTo("_drawCount");
    this.getAttribute("geometry").boundTo("_geometry");
  }

  public $mount(): void {
    this._transformComponent = this.node.getComponent("Transform") as TransformComponent;
    this._materialContainer = this.node.getComponent("MaterialContainer") as MaterialContainerComponent;
    this._containedScene = MeshRenderer._findContainedScene(this.node);
    this._containedScene.queueRegistory.addRenderable(this);
  }

  public $unmount(): void {
    this._containedScene.queueRegistory.removeRenderable(this);
  }

  public render(args: IRenderArgument): void {
    if (this._layer !== args.layer) {
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
      defaultTexture: args.defaultTexture
    };
    if (args.material) {
      renderArgs.attributeValues = args.materialArgs;
      args.material.draw(renderArgs);
    } else {
      renderArgs.attributeValues = this._materialContainer.materialArgs;
      this._materialContainer.material.draw(renderArgs);
    }
    this.companion.get("gl").flush();
  }
}
