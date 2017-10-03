import Geometry from "./Geometry";
import IGeometryFactoryDelegate from "./IGeometryFactoryDelegate";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import GLRelatedRegistryBase from "../Resource/GLRelatedRegistryBase";

/**
 * Provides the feature to instanciate primitive geometry.
 */
export default class GeometryFactory extends GLRelatedRegistryBase{

  public static registryName = "GeometryFactory";

  /**
   * Delegates to be used as factory
   */
  public static factoryDelegates: { [typeName: string]: IGeometryFactoryDelegate } = {};

  /**
   * Argument inputs to be used for construction of geometry.
   */
  public static factoryArgumentDeclarations: { [typeName: string]: { [argName: string]: IAttributeDeclaration } } = {};

  public static factoryExtentions: { [typeName: string]: ((geometry: Geometry, attrs: { [attrKey: string]: any }) => void)[] } = {};

  /**
   * Get geometry factory by WebGLRenderingContext
   * @param gl 
   */
  public static get(gl:WebGLRenderingContext):GeometryFactory{
    return this.__get(gl,GeometryFactory);
  }

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

  public static extend(typeName: string, extender: (geometry: Geometry, attrs: { [attrKey: string]: any }) => Promise<void> | void): void {
    if (GeometryFactory.factoryExtentions[typeName] === void 0) {
      GeometryFactory.factoryExtentions[typeName] = [];
    }
    GeometryFactory.factoryExtentions[typeName].push(extender);
  }

  constructor(public gl: WebGLRenderingContext) {
    super();
  }

  public async instanciate(type: string, args: { [argName: string]: any }): Promise<Geometry> {
    const factoryDelegate = GeometryFactory.factoryDelegates[type];
    if (!factoryDelegate) {
      throw new Error(`Can not instanciate unknown geometry type ${type}`);
    }
    const geometry = await factoryDelegate(this.gl, args);
    if (GeometryFactory.factoryExtentions[type] !== void 0) {
      const exts = GeometryFactory.factoryExtentions[type];
      for (let i = 0; i < exts.length; i++) {
        const p = exts[i](geometry, args);
        if (p) {
          await p;
        }
      }
    }
    return geometry;
  }

  public instanciateAsDefault(type: string): Promise<Geometry> {
    const decl = GeometryFactory.factoryArgumentDeclarations[type];
    const args: { [key: string]: any } = {};
    for (let attr in decl) {
      const attrDecl = decl[attr];
      args[attr] = attrDecl.default;
    }
    return this.instanciate(type, args);
  }
}
