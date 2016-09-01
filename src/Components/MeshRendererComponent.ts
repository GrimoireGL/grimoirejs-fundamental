import GLSLXPass from "../Material/GLSLXPass";
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
  private _materialArgs: { [key: string]: any } = {};
  private _targetBuffer: string;
  private _materialComponent: MaterialComponent;
  private _transformComponent: TransformComponent;

  public $awake() {
    this.geom = (this.companion.get("GeometryRegistory") as GeometryRegistory).getGeometry(this.getValue("geometry")); // geometry attribute should use geometry converter
    this.attributes.get("material").addObserver(this._onMaterialChanged);
    this._material = this.getValue("material");
    if (this._material) {
      this._onMaterialChanged();
    }
  }
  public $mount() {
    this._transformComponent = this.node.getComponent("Transform") as TransformComponent;
  }

  public $render(args: IRenderMessageArgs) {
    const renderArgs = {
      targetBuffer: this._targetBuffer,
      geometry: this.geom,
      attributeValues: {},
      camera: args.camera.camera,
      transform: this._transformComponent
    };
    if (this._materialComponent) {
      renderArgs.attributeValues = this._materialComponent.materialArgs;
      this._materialComponent.material.draw(renderArgs);
    } else if (this._material) {
      renderArgs.attributeValues = this._materialArgs;
      this._material.draw(renderArgs);
    }
    this.companion.get("gl").flush();
  }

  private _onMaterialChanged(): void {
    this._material = this.getValue("material");
    if (!this._materialComponent) { // the material must be instanciated by attribute.
      this._registerMaterialAttributes();
    }
  }

  private async _registerMaterialAttributes(): Promise<void> {
    await this._material.initializePromise;
    this._material.pass.forEach((p) => {
      if (p instanceof GLSLXPass) {
        for (let key in p.programInfo.gomlAttributes) {
          const val = p.programInfo.gomlAttributes[key];
          this.__addAtribute(key, val);
          this.attributes.get(key).addObserver((v) => {
            this._materialArgs[key] = v.Value;
          });
          this._materialArgs[key] = this.getValue(key);
        }
      }
    });
  }
}
