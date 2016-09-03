import Material from "./Material";
/**
 * Manage factories for materials.
 * Materials can be instanciated with this instance.
 */
export default class MaterialFactory {
  public static factories: { [key: string]: ((gl: WebGLRenderingContext) => Promise<Material>) } = {};

  public static registerdHandlers: { [key: string]: (() => void)[] } = {};

  public static addMaterialType(typeName: string, factory: (gl: WebGLRenderingContext) => Promise<Material>): void {
    MaterialFactory.factories[typeName] = factory;
    if (MaterialFactory.registerdHandlers[typeName]) { // Check registered handler are exisiting
      MaterialFactory.registerdHandlers[typeName].forEach((t) => t());
    }
  }

  private static _onRegister(factoryName: string, handler: () => void): void {
    if (MaterialFactory.registerdHandlers[factoryName]) {
      MaterialFactory.registerdHandlers[factoryName].push(handler);
    } else {
      MaterialFactory.registerdHandlers[factoryName] = [handler];
    }
  }

  constructor(public gl: WebGLRenderingContext) {

  }

  public async instanciate(typeName: string): Promise<Material> {
    if (MaterialFactory.factories[typeName]) {
      return MaterialFactory.factories[typeName](this.gl);
    } else { // when the type is not registered yet.
      return await this.waitForRegistered(typeName);
    }
  }

  private waitForRegistered(typeName: string): Promise<Material> {
    return new Promise<Material>((resolve) => {
      MaterialFactory._onRegister(typeName, () => {
        resolve(MaterialFactory.factories[typeName](this.gl));
      });
    });
  }
}
