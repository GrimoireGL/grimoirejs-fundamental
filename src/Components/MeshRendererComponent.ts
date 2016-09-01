import MaterialComponent from "./MaterialComponent";
import GeometryRegistory from "./GeometryRegistoryComponent";
import IRenderMessageArgs from "../Camera/IRenderMessageArgs";
import TransformComponent from "./TransformComponent";
import Geometry from "../Geometry/Geometry";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import Material from "../Material/Material";


export default class MeshRenderer extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    geometry: {
      converter: "string",
      defaultValue: "quad"
    },
    material: {
      converter: "material",
      defaultValue: undefined,
      boundTo: "_material",
      componentBoundTo: "_materialComponent"
    },
    targetBuffer: {
      converter: "string",
      defaultValue: "default",
      boundTo: "_targetBuffer"
    }
  };

  public geom: Geometry;
  private _material: Material;
  private _targetBuffer: string;
  private _materialComponent: MaterialComponent;
  private _transformComponent: TransformComponent;

  public $awake() {
    this.geom = (this.companion.get("GeometryRegistory") as GeometryRegistory).getGeometry(this.getValue("geometry")); // geometry attribute should use geometry converter
  }
  public $mount() {
    this._transformComponent = this.node.getComponent("Transform") as TransformComponent;
  }

  public $render(args: IRenderMessageArgs) {
    if (this._materialComponent) {
      this._materialComponent.material.draw({
        targetBuffer: this._targetBuffer,
        geometry: this.geom,
        attributeValues: this._materialComponent.materialArgs,
        camera: args.camera.camera,
        transform: this._transformComponent
      });
    }
    this.companion.get("gl").flush();
  }
}
