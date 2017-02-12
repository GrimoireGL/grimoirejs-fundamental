import DrawPriorty from "../SceneRenderer/DrawPriorty";
import Attribute from "grimoirejs/ref/Node/Attribute";
import gr from "grimoirejs";
import ResourceBase from "../Resource/ResourceBase";
import MaterialComponent from "./MaterialComponent";
import Material from "../Material/Material";
import AssetLoader from "../Asset/AssetLoader";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import GrimoireInterface from "grimoirejs";

/**
 * マテリアルとマテリアルへの属性を管理するためのコンポーネント
 * このコンポーネントは将来的に`MeshRenderer`と統合されます。
 * 指定されたマテリアルの初期化の管理や、マテリアルによって動的に追加される属性の管理を行います、
 */
export default class MaterialContainerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * 対象のマテリアル
     */
    material: {
      converter: "Material",
      default: "new(unlit)",
      componentBoundTo: "_materialComponent" // When the material was specified with the other material tag, this field would be assigned.
    },
    /**
     * 描画順序
     *
     * デフォルトの状態では、マテリアルから読み込んだ描画順序設定を用います
     */
    drawOrder: {
      converter: "String",
      default: null
    }
  };

  public static rewriteDefaultMaterial(materialName: string): void {
    if (materialName !== MaterialContainerComponent._defaultMaterial) {
      MaterialContainerComponent._defaultMaterial = materialName;
      GrimoireInterface.componentDeclarations.get("MaterialContainer").attributes["material"].default = `new(${materialName})`;
    }
  }

  public static get defaultMaterial(): string {
    return this._defaultMaterial;
  }

  private static _defaultMaterial = "unlit";

  public getDrawPriorty(depth: number): number {
    if (!this.materialReady) {
      return Number.MAX_VALUE;
    }
    const orderCriteria = DrawPriorty[this._drawOrder ? this._drawOrder : this.material.techniques["default"].drawOrder];
    if (orderCriteria === void 0) {
      throw new Error(`Specified drawing order "${this.material.techniques["default"].drawOrder}" is not defined`);
    }
    if (orderCriteria.descending) {
      return (1.0 - depth / 10000) * orderCriteria.priorty;
    } else {
      return depth / 10000 * orderCriteria.priorty;
    }
  }

  public material: Material;

  public materialArgs: { [key: string]: any; } = {};

  public materialReady: boolean = false;

  public useMaterial: boolean = false;

  private _materialComponent: MaterialComponent;

  private _drawOrder: string;

  private _registeredAttributes: boolean;

  public $mount(): void {
    this.getAttributeRaw("material").watch(this._onMaterialChanged.bind(this));
    (this.companion.get("loader") as AssetLoader).register(this._onMaterialChanged());
    this.getAttributeRaw("drawOrder").boundTo("_drawOrder");
  }

  /**
   * When the material attribute is changed.
   */
  private async _onMaterialChanged(): Promise<void> {
    const materialPromise = this.getAttribute("material") as Promise<Material>;
    if (materialPromise === void 0) {
      this.useMaterial = false;
      return; // When specified material is null
    }
    this.useMaterial = true;
    if (this._registeredAttributes) {
      this.__removeAttributes();
    }
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
    const material = await materialPromise; // waiting for material load completion
    this.material = material;
    this.materialArgs = this._materialComponent.materialArgs;
    this.materialReady = true;
  }

  private async _prepareInternalMaterial(materialPromise: Promise<Material>): Promise<void> {
    // obtain promise of instanciating material
    const loader = this.companion.get("loader") as AssetLoader;
    loader.register(materialPromise);
    if (!materialPromise) {
      return;
    }
    const material = await materialPromise; // waiting for material load completion
    this.material = material;
    for (let key in this.material.argumentDeclarations) {
      this.__addAtribute(key, this.material.argumentDeclarations[key]);
      try {
        this.getAttributeRaw(key).watch(v => {
          this.material.arguments[key] = v;
        }, true);
      } catch (e) {
        // TODO more convinient error handling
        this.node.emit("error-parse-material-args",e);
        this.__removeAttributes();
        this._registeredAttributes = false;
        this.materialReady = false;
        return;
      }
    }
    for (let key in this.material.macroDeclarations) {
      this.__addAtribute(key, this.material.macroDeclarations[key]);
      this.getAttributeRaw(key).watch((v) => {
        this.material.setMacroValue(key, v);
      }, true);
    }
    this._registeredAttributes = true;
    this.materialReady = true;
  }

}
