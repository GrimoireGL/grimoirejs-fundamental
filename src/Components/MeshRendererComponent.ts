import gr from "grimoirejs";
import MaterialContainerComponent from "./MaterialContainerComponent";
import IMaterialArgument from "../Material/IMaterialArgument";
import GeometryRegistory from "./GeometryRegistoryComponent";
import IRenderMessage from "../Messages/IRenderMessage";
import TransformComponent from "./TransformComponent";
import Geometry from "../Geometry/Geometry";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";


export default class MeshRenderer extends Component {
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
  private _layer: string;
  private _drawOffset: number;
  private _drawCount: number;

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
  }

  public $render(args: IRenderMessage): void {
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
