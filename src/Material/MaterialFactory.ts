import SortParser from "../Sort/Parser";
import DrawPriorty from "../SceneRenderer/DrawPriorty";
import MacroRegistory from "./MacroRegistory";
import TextFileResolver from "../Asset/TextFileResolver";
import Material from "./Material";
import ShaderHeader from "raw!./Static/header.glsl";
/**
 * Manage generators for materials.
 * Materials can be instanciated with this instance.
 * Every gl reference can contain 1 of MaterialFactory at most.
 */
export default class MaterialFactory {

  /**
   * Map for gl reference and MaterialFactory.
   * @type {Map<WebGLRenderingContext,MaterialFactory>}
   */
  public static factories:Map<WebGLRenderingContext,MaterialFactory> = new Map<WebGLRenderingContext,MaterialFactory>();

  /**
   * Obtain an instance of MaterialFactory from WebGLRenderingContext
   * @param  {WebGLRenderingContext} gl [description]
   * @return {MaterialFactory}          [description]
   */
  public static get(gl:WebGLRenderingContext):MaterialFactory{
    const factory = this.factories.get(gl);
    if(!factory){
      throw new Error("There was no associated MaterialFactory with specified WebGLRenderingContext");
    }
    return factory;
  }

  public static defaultShaderHeader: string = ShaderHeader;
  /**
   * Actual material generator.
   */
  public static generators: { [key: string]: ((factory: MaterialFactory) => Material) } = {};

  public static registerdHandlers: { [key: string]: (() => void)[] } = {};

  public static addMaterialType(typeName: string, factory: (factory: MaterialFactory) => Material): void {
    MaterialFactory.generators[typeName] = factory;
    if (MaterialFactory.registerdHandlers[typeName]) { // Check registered handler are exisiting
      MaterialFactory.registerdHandlers[typeName].forEach((t) => t());
    }
  }

  /**
   * Add source of .sort material as specified typename.
   * @param  {string}        typeName [description]
   * @param  {string}        source   [description]
   * @return {Promise<void>}          [description]
   */
  public static async addSORTMaterial(typeName: string, source: string): Promise<void> {
    const techniques = await SortParser.parse(source);
    MaterialFactory.addMaterialType(typeName, (factory) => {
      return new Material(factory.gl, techniques);
    });
  }

  /**
   * Add source of .sort material from external url as specified typeName.
   * @param  {string}        typeName [description]
   * @param  {string}        url      [description]
   * @return {Promise<void>}          [description]
   */
  public static async addSORTMaterialFromURL(typeName: string, url: string): Promise<void> {
    const source = await TextFileResolver.resolve(url);
    await MaterialFactory.addSORTMaterial(typeName, source);
  }

  private static _onRegister(factoryName: string, handler: () => void): void {
    if (MaterialFactory.registerdHandlers[factoryName]) {
      MaterialFactory.registerdHandlers[factoryName].push(handler);
    } else {
      MaterialFactory.registerdHandlers[factoryName] = [handler];
    }
  }

  public shaderHeader: string = MaterialFactory.defaultShaderHeader;

  public macro: MacroRegistory;

  constructor(public gl: WebGLRenderingContext) {
    this.macro = new MacroRegistory();
    if(MaterialFactory.factories.has(gl)){
      throw new Error(`MaterialFactory can not be instanciated dupelicately for a WebGLRenderingContext.`);
    }
    MaterialFactory.factories.set(gl,this);
  }

  public async instanciate(typeName: string): Promise<Material> {
    if (MaterialFactory.generators[typeName]) {
      return MaterialFactory.generators[typeName](this);
    } else { // when the type is not registered yet.
      return await this._waitForRegistered(typeName);
    }
  }


  private _waitForRegistered(typeName: string): Promise<Material> {
    return new Promise<Material>((resolve) => {
      MaterialFactory._onRegister(typeName, () => {
        resolve(MaterialFactory.generators[typeName](this));
      });
    });
  }
}
