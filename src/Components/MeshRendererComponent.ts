import AssetLoader from "../Asset/AssetLoader";
import ResourceBase from "../Resource/ResourceBase";
import SORTPass from "../Material/SORTPass";
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
      componentBoundTo: "_materialComponent" // When the material was specified with the other material tag, this field would be assigned.
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

  public $mount() {
    this._transformComponent = this.node.getComponent("Transform") as TransformComponent;
    this.geom = (this.companion.get("GeometryRegistory") as GeometryRegistory).getGeometry(this.getValue("geometry")); // geometry attribute should use geometry converter
    this.attributes.get("material").addObserver(this._onMaterialChanged);
    this._onMaterialChanged();
  }

  public $render(args: IRenderMessageArgs) {
    if (!this._material) {
      return; // material is not instanciated yet.
    }
    const renderArgs = {
      targetBuffer: this._targetBuffer,
      geometry: this.geom,
      attributeValues: {},
      camera: args.camera.camera,
      transform: this._transformComponent
    };
    if (this._materialComponent) {
      renderArgs.attributeValues = this._materialComponent.materialArgs;
    } else {
      renderArgs.attributeValues = this._materialArgs;
    }
    this._material.draw(renderArgs);
    this.companion.get("gl").flush();
  }

  private _onMaterialChanged(): void {
    if (!this._materialComponent) { // the material must be instanciated by attribute.
      this._prepareInternalMaterial();
    } else {
      this._prepareExternalMaterial();
    }
  }

  private async _prepareExternalMaterial(): Promise<void> {
    const materialPromise = this.getValue("material") as Promise<Material>
    const loader = this.companion.get("loader") as AssetLoader;
    loader.register(materialPromise);
    const material = await materialPromise;
    this._material = material;
  }

  private async _prepareInternalMaterial(): Promise<void> {
    // obtain promise of instanciating material
    const materialPromise = this.getValue("material") as Promise<Material>;
    const loader = this.companion.get("loader") as AssetLoader;
    loader.register(materialPromise);
    if (!materialPromise) {
      return;
    }
    const material = await materialPromise;
    const promises: Promise<any>[] = [];
    material.pass.forEach((p) => {
      if (p instanceof SORTPass) {
        for (let key in p.programInfo.gomlAttributes) {
          const val = p.programInfo.gomlAttributes[key];
          this.__addAtribute(key, val);
          this.attributes.get(key).addObserver((v) => {
            this._materialArgs[key] = v.Value;
          });
          const value = this._materialArgs[key] = this.getValue(key);
          if (value instanceof ResourceBase) {
            promises.push((value as ResourceBase).validPromise);
          }
        }
      }
    });
    await Promise.all(promises);
    this._material = material;
  }
}
