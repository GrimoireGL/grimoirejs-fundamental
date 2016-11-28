import DrawPriorty from "../SceneRenderer/DrawPriorty";
import SORTPass from "./SORTPass";
import MacroRegistory from "./MacroRegistory";
import PassFactory from "./PassFactory";
import TextFileResolver from "../Asset/TextFileResolver";
import Material from "./Material";
import ShaderHeader from "raw!./Static/header.glsl";
/**
 * Manage factories for materials.
 * Materials can be instanciated with this instance.
 */
export default class MaterialFactory {

  public static defaultShaderHeader: string = ShaderHeader;
  /**
   * Actual material generator.
   */
  public static factories: { [key: string]: ((factory: MaterialFactory) => Material) } = {};

  public static registerdHandlers: { [key: string]: (() => void)[] } = {};

  public static addMaterialType(typeName: string, factory: (factory: MaterialFactory) => Material): void {
    MaterialFactory.factories[typeName] = factory;
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
    const sortInfos = await PassFactory.passInfoFromSORT(source);
    MaterialFactory.addMaterialType(typeName, (factory) => {
      const sorts = sortInfos.map(p => new SORTPass(factory, p));
      return new Material(sorts, MaterialFactory._parseSortDrawOrder(source));
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
  }

  public async instanciate(typeName: string): Promise<Material> {
    if (MaterialFactory.factories[typeName]) {
      return MaterialFactory.factories[typeName](this);
    } else { // when the type is not registered yet.
      return await this._waitForRegistered(typeName);
    }
  }

  private static _parseSortDrawOrder(source: string): string {
    const regex = /@DrawOrder\(\s*([a-zA-Z0-9]+)\s*\)/;
    const result = regex.exec(source);
    if (!result) {
      return undefined;
    } else {
      const drawOrder = result[1];
      if (DrawPriorty[drawOrder] === void 0) {
        throw new Error(`Specified draw order ${drawOrder} was not found.`);
      } else {
        return drawOrder;
      }
    }
  }

  private _waitForRegistered(typeName: string): Promise<Material> {
    return new Promise<Material>((resolve) => {
      MaterialFactory._onRegister(typeName, () => {
        resolve(MaterialFactory.factories[typeName](this));
      });
    });
  }
}
