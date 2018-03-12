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
import { attribute, watch, overrideGetter, companion } from "grimoirejs/ref/Core/Decorator";
import MaterialFactory from "../Material/MaterialFactory";
/**
 * マテリアルとマテリアルへの属性を管理するためのコンポーネント
 * このコンポーネントは将来的に`MeshRenderer`と統合されます。
 * 指定されたマテリアルの初期化の管理や、マテリアルによって動的に追加される属性の管理を行います、
 */
export default class MaterialContainer extends MaterialContainerBase {
  public static componentName = "MaterialContainer";

  /**
   * Material referrence.
   * This can be null or undefined because of promise attribute.
   */
  @overrideGetter((v: IMaterialResolutionResult) => v ? v.material : null)
  @attribute(MaterialConverter, null)
  public material!: Material;
  /**
   * Draw order of this material.
   * If you specify Auto, material will use default material draw order loaded from .sort material.
   */
  @attribute(StringConverter, "Auto")
  public drawOrder!: string;

  /**
   * Transparent or not.
   * This flag will be used for calculating draw order that needs to be determined with transparency.
   * If you need to display large object without transparency, you should make this flag false to prevent the other small transparency object rendered correctly.
   */
  @attribute(BooleanConverter, true)
  public transparent!: boolean;

  private _attributeExposed: boolean = false;

  private _internalMaterialSet: boolean = false;

  @companion("gl")
  private gl!: WebGLRenderingContext;

  public getDrawPriorty(depth: number, technique: string): number {
    if (!this.isActive) { // If material was not ready
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
  /**
   * When the material attribute is changed.
   */
  @watch("material", true)
  private async _onMaterialChanged(materialResolutionResult: IMaterialResolutionResult, old: IMaterialResolutionResult): Promise<void> {
    if (materialResolutionResult === old || this._internalMaterialSet) {
      return;
    }
    if (this._attributeExposed) {
      this.__removeExposedMaterialParameters();
    }
    if (materialResolutionResult === null) {
      const mat = await MaterialFactory.get(this.gl).instanciateDefault();
      this._internalMaterialSet = true;
      this.material = mat;
      this._internalMaterialSet = false;
      this.__exposeMaterialParameters(mat);
      this._attributeExposed = true;
      return; // When specified material is null
    }
    if (!materialResolutionResult.external) { // the material must be instanciated by attribute.
      this.__exposeMaterialParameters(this.material);
      this._attributeExposed = true;
    }
  }
}
