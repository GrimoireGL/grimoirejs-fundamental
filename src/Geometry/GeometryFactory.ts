import Geometry from "./Geometry";
import IGeometryFactoryDelegate from "./IGeometryFactoryDelegate";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";
/**
 * Provides the feature to instanciate primitive geometry.
 */
export default class GeometryFactory {
  /**
   * Delegates to be used as factory
   */
  public static factoryDelegates: { [typeName: string]: IGeometryFactoryDelegate } = {};

  /**
   * Argument inputs to be used for construction of geometry.
   */
  public static factoryArgumentDeclarations: { [typeName: string]: { [argName: string]: IAttributeDeclaration } } = {};

  /**
   * Add new type geometry
   * @param {string}                   typeName        [description]
   * @param {IAttributeDeclaration }}             argumentDeclarations [description]
   * @param {IGeometryFactoryDelegate} factoryDelegate [description]
   */
  public static addType(typeName: string, argumentDeclarations: { [argName: string]: IAttributeDeclaration }, factoryDelegate: IGeometryFactoryDelegate): void {
    GeometryFactory.factoryDelegates[typeName] = factoryDelegate;
    GeometryFactory.factoryArgumentDeclarations[typeName] = argumentDeclarations;
  }

  constructor(public gl: WebGLRenderingContext) {

  }

  public instanciate(type: string, args: { [argName: string]: any }): Geometry {
    const factoryDelegate = GeometryFactory.factoryDelegates[type];
    if (!factoryDelegate) {
      throw new Error(`Can not instanciate unknown geometry type ${type}`);
    }
    return factoryDelegate(this.gl, args);
  }

  public instanciateAsDefault(type: string): Geometry {
    const decl = GeometryFactory.factoryArgumentDeclarations[type];
    const args = {};
    for (let attr in decl) {
      const attrDecl = decl[attr];
      args[attr] = attrDecl.defaultValue;
    }
    return this.instanciate(type, args);
  }
}
