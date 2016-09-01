import Material from "./Material";
/**
 * Manage factories for materials.
 * Materials can be instanciated with this instance.
 */
export default class MaterialFactory {
  public static factories: { [key: string]: ((gl: WebGLRenderingContext) => Material) } = {};

  public static addMaterialType(typeName: string, factory: (gl: WebGLRenderingContext) => Material): void {
    MaterialFactory.factories[typeName] = factory;
  }

  constructor(public gl: WebGLRenderingContext) {

  }

  public instanciate(typeName: string): Material {
    if (MaterialFactory.factories[typeName]) {
      return MaterialFactory.factories[typeName](this.gl);
    }
  }
}
