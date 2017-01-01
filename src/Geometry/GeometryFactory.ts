import gr from "grimoirejs";
import Geometry from "./Geometry";
import IGeometryFactoryDelegate from "./IGeometryFactoryDelegate";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
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

    public static factoryExtentions: { [typeName: string]: ((geometry: Geometry, attrs: { [attrKey: string]: any }) => void)[] } = {};

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

    public static extend(typeName: string, extender: (geometry: Geometry, attrs: { [attrKey: string]: any }) => void): void {
      if(GeometryFactory.factoryExtentions[typeName] === void 0){
        GeometryFactory.factoryExtentions[typeName] = [];
      }
      GeometryFactory.factoryExtentions[typeName].push(extender);
    }

    constructor(public gl: WebGLRenderingContext) {

    }

    public instanciate(type: string, args: { [argName: string]: any }): Geometry {
        const factoryDelegate = GeometryFactory.factoryDelegates[type];
        if (!factoryDelegate) {
            throw new Error(`Can not instanciate unknown geometry type ${type}`);
        }
        const geometry = factoryDelegate(this.gl, args);
        if(GeometryFactory.factoryExtentions[type] !== void 0){
          GeometryFactory.factoryExtentions[type].forEach(v=>v(geometry,args));
        }
        return geometry;
    }

    public instanciateAsDefault(type: string): Geometry {
        const decl = GeometryFactory.factoryArgumentDeclarations[type];
        const args = {};
        for (let attr in decl) {
            const attrDecl = decl[attr];
            args[attr] = attrDecl.default;
        }
        return this.instanciate(type, args);
    }
}
