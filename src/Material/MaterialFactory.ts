import SortParser from "../Sort/Parser";
import DrawPriorty from "../SceneRenderer/DrawPriorty";
import MacroRegistory from "./MacroRegistory";
import TextFileResolver from "../Asset/TextFileResolver";
import Material from "./Material";
import NameResolver from "../Asset/NameResolver";
import ShaderHeader from "raw-loader!../Shaders/header.glsl";
/**
 * Manage materialGenerators for materials.
 * Materials can be instanciated with this instance.
 * Every gl reference can contain 1 of MaterialFactory at most.
 */
export default class MaterialFactory {

    /**
     * Map for gl reference and MaterialFactory.
     * @type {Map<WebGLRenderingContext,MaterialFactory>}
     */
    public static factories: Map<WebGLRenderingContext, MaterialFactory> = new Map<WebGLRenderingContext, MaterialFactory>();

    public static defaultShaderHeader: string = ShaderHeader;

    public static materialGeneratorResolver: NameResolver<(factory: MaterialFactory) => Material> = new NameResolver<(factory: MaterialFactory) => Material>();

    /**
     * Obtain an instance of MaterialFactory from WebGLRenderingContext
     * @param  {WebGLRenderingContext} gl [description]
     * @return {MaterialFactory}          [description]
     */
    public static get(gl: WebGLRenderingContext): MaterialFactory {
        const factory = this.factories.get(gl);
        if (!factory) {
            throw new Error("There was no associated MaterialFactory with specified WebGLRenderingContext");
        }
        return factory;
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
        return this.materialGeneratorResolver.register(typeName, (async () => {
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
    public static addSORTMaterialFromURL(typeName: string, url: string): Promise<(factory: MaterialFactory) => Material> {
        return this.materialGeneratorResolver.register(typeName, (async () => {
            const source = await TextFileResolver.resolve(url);
            const techniques = await SortParser.parse(source);
            return (factory) => {
                return new Material(factory.gl, techniques);
            };
        })());
    }

    public shaderHeader: string = MaterialFactory.defaultShaderHeader;

    public macro: MacroRegistory;

    constructor(public gl: WebGLRenderingContext) {
        this.macro = new MacroRegistory();
        if (MaterialFactory.factories.has(gl)) {
            throw new Error(`MaterialFactory can not be instanciated dupelicately for a WebGLRenderingContext.`);
        }
        MaterialFactory.factories.set(gl, this);
    }

    public async instanciate(typeName: string): Promise<Material> {
        const generator =  await MaterialFactory.materialGeneratorResolver.get(typeName);
        return generator(this);
    }
}
