import MaterialContainerComponent from "./MaterialContainerComponent";
import IMaterialArgument from "../Material/IMaterialArgument";
import GeometryRegistory from "./GeometryRegistoryComponent";
import IRenderMessage from "../Messages/IRenderMessage";
import TransformComponent from "./TransformComponent";
import Geometry from "../Geometry/Geometry";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";


export default class MeshRenderer extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    geometry: {
      converter: "string",
      defaultValue: "quad"
    },
    targetBuffer: {
      converter: "string",
      defaultValue: "default",
      boundTo: "_targetBuffer"
    },
    layer: {
      converter: "string",
      defaultValue: "default",
      boundTo: "_layer"
    }
  };

  public geom: Geometry;
  private _targetBuffer: string;
  private _materialContainer: MaterialContainerComponent;
  private _transformComponent: TransformComponent;
  private _layer: string;

  public $mount() {
    this._transformComponent = this.node.getComponent("Transform") as TransformComponent;
    this.geom = (this.companion.get("GeometryRegistory") as GeometryRegistory).getGeometry(this.getValue("geometry")); // geometry attribute should use geometry converter
    this._materialContainer = this.node.getComponent("MaterialContainer") as MaterialContainerComponent;
  }

  public $render(args: IRenderMessage) {
    if (this._layer !== args.layer) {
      return; // material is not instanciated yet.
    }
    if (!args.material && !this._materialContainer.ready) {
      return;
    }
    const renderArgs = <IMaterialArgument>{
      targetBuffer: this._targetBuffer,
      geometry: this.geom,
      attributeValues: null,
      camera: args.camera.camera,
      transform: this._transformComponent,
      buffers: args.buffers,
      viewport: args.viewport
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
