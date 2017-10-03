import DrawPriorty from "../SceneRenderer/DrawPriorty";
import Attribute from "grimoirejs/ref/Node/Attribute";
import gr from "grimoirejs";
import ResourceBase from "../Resource/ResourceBase";
import MaterialComponent from "./MaterialComponent";
import Material from "../Material/Material";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import GrimoireInterface from "grimoirejs";
import BasicComponent from "./BasicComponent";
import MaterialContainerBase from "./MaterialContainerBase";

/**
 * マテリアルとマテリアルへの属性を管理するためのコンポーネント
 * このコンポーネントは将来的に`MeshRenderer`と統合されます。
 * 指定されたマテリアルの初期化の管理や、マテリアルによって動的に追加される属性の管理を行います、
 */
export default class MaterialContainerComponent extends MaterialContainerBase {
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
      default: "Auto"
    },
    transparent: {
      converter: "Boolean",
      default: true
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

  public getDrawPriorty(depth: number, technique: string): number {
    if (!this.materialReady && !this.isActive) { // If material was not ready
      return Number.MAX_VALUE;
    }
    let orderCriteria;
    if (this._drawOrder === "Auto") {
      if (this.material.techniques[technique].drawOrder === "Auto") {
        orderCriteria = DrawPriorty[this._transparent ? "UseAlpha" : "NoAlpha"];
      } else {
        orderCriteria = DrawPriorty[this.material.techniques[technique].drawOrder];
      }
    } else {
      orderCriteria = DrawPriorty[this._drawOrder];
    }
    if (orderCriteria === void 0) {
      throw new Error(`Specified drawing order "${this.material.techniques[technique].drawOrder}" is not defined`);
    }
    if (orderCriteria.descending) {
      return (1.0 - depth / 10000) * orderCriteria.priorty;
    } else {
      return depth / 10000 * orderCriteria.priorty;
    }
  }

  public material: Material;

  public materialArgs: { [key: string]: any; } = {};

  public materialReady = false;

  public useMaterial = false;

  private _materialComponent: MaterialComponent;

  private _drawOrder: string;

  private _registeredAttributes: boolean;

  private _transparent: boolean;

  public $mount(): void {
    this.getAttributeRaw("material").watch(this._onMaterialChanged.bind(this));
    this.__registerAssetLoading(this._onMaterialChanged());
    this.getAttributeRaw("drawOrder").boundTo("_drawOrder");
    this.getAttributeRaw("transparent").boundTo("_transparent");
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
      await this._prepareInternalMaterial(materialPromise);
    } else {
      await this._prepareExternalMaterial(materialPromise);
    }
  }

  /**
   * Resolve materials only when the material required from external material component.
   * @return {Promise<void>} [description]
   */
  private async _prepareExternalMaterial(materialPromise: Promise<Material>): Promise<void> {
    const material = await materialPromise; // waiting for material load completion
    this.material = material;
    this.materialArgs = this._materialComponent.materialArgs;
    this.materialReady = true;
  }

  private async _prepareInternalMaterial(materialPromise: Promise<Material>): Promise<void> {
    // obtain promise of instanciating material
    if (!materialPromise) {
      return;
    }
    const material = await materialPromise; // waiting for material load completion
    this.material = material;
    this.__exposeMaterialParameters(this.material);
    this._registeredAttributes = true;
    this.materialReady = true;
  }

}
