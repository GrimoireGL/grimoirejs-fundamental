import GrimoireInterface from "grimoirejs";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Material from "../Material/Material";
import DrawPriorty from "../SceneRenderer/DrawPriorty";
import MaterialComponent from "./MaterialComponent";
import MaterialContainerBase from "./MaterialContainerBase";
import { IConverterDeclaration, IStandardConverterDeclaration, ILazyConverterDeclaration } from "grimoirejs/ref/Interface/IAttributeConverterDeclaration";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import { MaterialConverter } from "../Converters/MaterialConverter";
import { LazyAttribute, StandardAttribute } from "grimoirejs/ref/Core/Attribute";
import Identity from "grimoirejs/ref/Core/Identity";
import IMaterialResolutionResult from "../Material/MaterialResolutionResult";
/**
 * マテリアルとマテリアルへの属性を管理するためのコンポーネント
 * このコンポーネントは将来的に`MeshRenderer`と統合されます。
 * 指定されたマテリアルの初期化の管理や、マテリアルによって動的に追加される属性の管理を行います、
 */
export default class MaterialContainer extends MaterialContainerBase {
  public static componentName = "MaterialContainer";
  public static attributes = {
    /**
     * 対象のマテリアル
     */
    material: {
      converter: MaterialConverter,
      default: "new(unlit)"
    },
    /**
     * 描画順序
     * デフォルトの状態では、マテリアルから読み込んだ描画順序設定を用います
     */
    drawOrder: {
      converter: StringConverter,
      default: "Auto",
    },
    transparent: {
      converter: BooleanConverter,
      default: true,
    },
  };

  public static rewriteDefaultMaterial(materialName: string): void {
    if (materialName !== MaterialContainer._defaultMaterial) {
      MaterialContainer._defaultMaterial = materialName;
      GrimoireInterface.componentDeclarations.get("MaterialContainer")!.attributes["material"].default = `new(${materialName})`;
    }
  }

  public static get defaultMaterial(): string {
    return this._defaultMaterial;
  }

  private static _defaultMaterial = "unlit";

  public getDrawPriorty(depth: number, technique: string): number {
    if (!this.useMaterial && !this.isActive) { // If material was not ready
      return Number.MAX_VALUE;
    }
    let orderCriteria;
    if (this.drawOrder === "Auto") {
      if (this.material.techniques[technique].drawOrder === "Auto") {
        orderCriteria = DrawPriorty[this.transparent ? "UseAlpha" : "NoAlpha"];
      } else {
        orderCriteria = DrawPriorty[this.material.techniques[technique].drawOrder];
      }
    } else {
      orderCriteria = DrawPriorty[this.drawOrder];
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
  public useMaterial = false;

  public material!: Material;

  public drawOrder!: string;

  public transparent!: boolean;

  private _attributeExposed!: boolean;


  protected $mount(): void {
    this.getAttributeRaw(MaterialContainer.attributes.material)!.watch(this._onMaterialChanged.bind(this));
    this.getAttributeRaw(MaterialContainer.attributes.drawOrder)!.bindTo("drawOrder");
    this.getAttributeRaw(MaterialContainer.attributes.transparent)!.bindTo("transparent");
  }

  /**
   * When the material attribute is changed.
   */
  private _onMaterialChanged(materialResolutionResult: IMaterialResolutionResult): void {
    if (materialResolutionResult === null) {
      this.useMaterial = false;
      return; // When specified material is null
    }
    this.useMaterial = true;
    if (this._attributeExposed) {
      this.__removeExposedMaterialParameters();
    }
    this.material = materialResolutionResult.material;
    if (!materialResolutionResult.external) { // the material must be instanciated by attribute.
      this.__exposeMaterialParameters(this.material);
      this._attributeExposed = true;
    }
  }
}
