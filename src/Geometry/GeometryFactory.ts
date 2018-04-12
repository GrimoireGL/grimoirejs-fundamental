import { IAttributeDeclaration, IStandardAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import GLRelatedRegistryBase from "../Resource/GLRelatedRegistryBase";
import Geometry from "./Geometry";
import IGeometryFactoryDelegate from "./IGeometryFactoryDelegate";

/**
 * Provides the feature to instanciate primitive geometry.
 */
export default class GeometryFactory extends GLRelatedRegistryBase {

  public static registryName = "GeometryFactory";

  /**
   * Delegates to be used as factory
   */
  public static factoryDelegates: { [typeName: string]: IGeometryFactoryDelegate } = {};

  /**
   * Argument inputs to be used for construction of geometry.
   */
  public static factoryArgumentDeclarations: { [typeName: string]: { [argName: string]: IStandardAttributeDeclaration } } = {};

  /**
   * Get geometry factory by WebGLRenderingContext
   * @param gl
   */
  public static get(gl: WebGLRenderingContext): GeometryFactory {
    return this.__get(gl, GeometryFactory);
  }

  /**
   * Add new type geometry
   * @param {string}                   typeName        [description]
   * @param {IAttributeDeclaration }}             argumentDeclarations [description]
   * @param {IGeometryFactoryDelegate} factoryDelegate [description]
   */
  public static addType(typeName: string, argumentDeclarations: { [argName: string]: IStandardAttributeDeclaration }, factoryDelegate: IGeometryFactoryDelegate): void {
    GeometryFactory.factoryDelegates[typeName] = factoryDelegate;
    GeometryFactory.factoryArgumentDeclarations[typeName] = argumentDeclarations;
  }

  constructor(public gl: WebGLRenderingContext) {
    super();
  }

  public async instanciate(type: string, args: { [argName: string]: any }): Promise<Geometry> {
    const factoryDelegate = GeometryFactory.factoryDelegates[type];
    const decl = GeometryFactory.factoryArgumentDeclarations[type];
    if (!factoryDelegate) {
      throw new Error(`Can not instanciate unknown geometry type ${type}`);
    }
    const geometry = new Geometry(this.gl, args);
    await factoryDelegate(geometry);
    return geometry;
  }

  public instanciateAsDefault(type: string): Promise<Geometry> {
    const decl = GeometryFactory.factoryArgumentDeclarations[type];
    const args: { [key: string]: any } = {};
    for (const attr in decl) {
      const attrDecl = decl[attr];
      args[attr] = attrDecl.default;
    }
    return this.instanciate(type, args);
  }
}
