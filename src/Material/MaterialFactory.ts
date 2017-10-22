import ShaderHeader from "raw-loader!../Shaders/header.glsl";
import NameResolver from "../Asset/NameResolver";
import TextFileResolver from "../Asset/TextFileResolver";
import GLRelatedRegistryBase from "../Resource/GLRelatedRegistryBase";
import SortParser from "../Sort/Parser";
import MacroRegistory from "./MacroRegistory";
import Material from "./Material";
/**
 * Manage materialGenerators for materials.
 * Materials can be instanciated with this instance.
 * Every gl reference can contain 1 of MaterialFactory at most.
 */
export default class MaterialFactory extends GLRelatedRegistryBase {
  public static registryName = "MaterialFactory";

  public static defaultShaderHeader: string = ShaderHeader;

  public static materialGeneratorResolver: NameResolver<(factory: MaterialFactory) => Material> = new NameResolver<(factory: MaterialFactory) => Material>();

  /**
   * Obtain an instance of MaterialFactory from WebGLRenderingContext
   * @param  {WebGLRenderingContext} gl [description]
   * @return {MaterialFactory}          [description]
   */
  public static get(gl: WebGLRenderingContext): MaterialFactory {
    return GLRelatedRegistryBase.__get(gl, MaterialFactory);
  }

  public static addMaterialType(typeName: string, materialGenerator: (factory: MaterialFactory) => Material): void {
    this.materialGeneratorResolver.register(typeName, Promise.resolve(materialGenerator));
  }

  /**
   * Add source of .sort material as specified typename.
   * @param  {string}        typeName [description]
   * @param  {string}        source   [description]
   * @return {Promise<void>}          [description]
   */
  public static async addSORTMaterial(typeName: string, source: string): Promise<(factory: MaterialFactory) => Material> {
    return this.materialGeneratorResolver.register(typeName, (async() => {
      const techniques = await SortParser.parse(source);
      return (factory) => {
        return new Material(factory.gl, techniques);
      };
    })());
  }

  /**
   * Add source of .sort material from external url as specified typeName.
   * @param  {string}        typeName [description]
   * @param  {string}        url      [description]
   * @return {Promise<void>}          [description]
   */
  public static async addSORTMaterialFromURL(typeName: string, url: string): Promise<(factory: MaterialFactory) => Material> {
    return this.materialGeneratorResolver.register(typeName, (async() => {
      const source = await TextFileResolver.resolve(url);
      const techniques = await SortParser.parse(source);
      return (factory) => {
        return new Material(factory.gl, techniques);
      };
    })());
  }

  public static getMaterialStatus(typeName: string): number {
    return this.materialGeneratorResolver.getStatus(typeName);
  }

  public shaderHeader: string = MaterialFactory.defaultShaderHeader;

  public macro: MacroRegistory;

  constructor(public gl: WebGLRenderingContext) {
    super();
    this.macro = new MacroRegistory();
  }

  public async instanciate(typeName: string): Promise<Material> {
    const generator = await MaterialFactory.materialGeneratorResolver.get(typeName);
    return generator(this);
  }
}
