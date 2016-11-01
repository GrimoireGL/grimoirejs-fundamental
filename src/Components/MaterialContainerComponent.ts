import ResourceBase from "../Resource/ResourceBase";
import MaterialComponent from "./MaterialComponent";
import SORTPass from "../Material/SORTPass";
import Material from "../Material/Material";
import AssetLoader from "../Asset/AssetLoader";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";

export default class MaterialContainerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    material: {
      converter: "Material",
      defaultValue: "new(unlit)",
      componentBoundTo: "_materialComponent" // When the material was specified with the other material tag, this field would be assigned.
    }
  };

  public material: Material;

  public materialArgs: { [key: string]: any; } = {};

  public ready: boolean = false;

  public useMaterial: boolean = false;

  private _materialComponent: MaterialComponent;

  public $mount(): void {
    this.attributes.get("material").addObserver(this._onMaterialChanged);
    (this.companion.get("loader") as AssetLoader).register(this._onMaterialChanged());
  }

  /**
   * When the material attribute is changed.
   */
  private async _onMaterialChanged(): Promise<void> {
    const materialPromise = this.getValue("material") as Promise<Material>;
    if (materialPromise === void 0) {
      this.useMaterial = false;
      return; // When specified material is null
    }
    this.useMaterial = true;
    if (!this._materialComponent) { // the material must be instanciated by attribute.
      this._prepareInternalMaterial(materialPromise);
    } else {
      this._prepareExternalMaterial(materialPromise);
    }
  }

  /**
   * Resolve materials only when the material required from external material component.
   * @return {Promise<void>} [description]
   */
  private async _prepareExternalMaterial(materialPromise: Promise<Material>): Promise<void> {
    const loader = this.companion.get("loader") as AssetLoader;
    loader.register(materialPromise);
    const material = await materialPromise;
    this.material = material;
    this.materialArgs = this._materialComponent.materialArgs;
    this.ready = true;
  }

  private async _prepareInternalMaterial(materialPromise: Promise<Material>): Promise<void> {
    // obtain promise of instanciating material
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
            this.materialArgs[key] = v.Value;
          });
          const value = this.materialArgs[key] = this.getValue(key);
          if (value instanceof ResourceBase) {
            promises.push((value as ResourceBase).validPromise);
          }
        }
      }
    });
    Promise.all(promises);
    this.material = material;
    this.ready = true;
  }

}
