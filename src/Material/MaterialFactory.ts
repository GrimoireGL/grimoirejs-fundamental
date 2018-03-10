import ShaderHeader from "raw-loader!../Shaders/header.glsl";
import NameResolver from "../Asset/NameResolver";
import TextFileResolver from "../Asset/TextFileResolver";
import GLRelatedRegistryBase from "../Resource/GLRelatedRegistryBase";
import SortParser from "../Sort/Parser";
import MacroRegistry from "./MacroRegistry";
import Material from "./Material";
/**
 * Manage materialGenerators for materials.
 * Materials can be instanciated with this instance.
 * Every gl reference can contain 1 of MaterialFactory at most.
 */
export default class MaterialFactory extends GLRelatedRegistryBase {
    public static registryName = "MaterialFactory";

    /**
     * Default shader to be used when material name was not provided.
     */
    public static defaultMaterialName = "unlit";

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
    public static async addSORTMaterial(typeName: string, source: string, overrideIfExists = true): Promise<(factory: MaterialFactory) => Material> {
        if (this.getMaterialStatus(typeName) === NameResolver.UNLOADED || overrideIfExists) {
            return this.materialGeneratorResolver.register(typeName, (async () => {
                const techniques = await SortParser.parse(source);
                return (factory: MaterialFactory) => {
                    return new Material(factory.gl, techniques);
                };
            })());
        } else {
            return this.materialGeneratorResolver.get(typeName);
        }
    }

    /**
     * Add source of .sort material from external url as specified typeName.
     * @param  {string}        typeName [description]
     * @param  {string}        url      [description]
     * @return {Promise<void>}          [description]
     */
    public static async addSORTMaterialFromURL(typeName: string, url: string, overrideIfExists = true): Promise<(factory: MaterialFactory) => Material> {
        return MaterialFactory.addSORTMaterial(typeName, await TextFileResolver.resolve(url), overrideIfExists);
    }

    public static getMaterialStatus(typeName: string): number {
        return this.materialGeneratorResolver.getStatus(typeName);
    }

    public shaderHeader: string = MaterialFactory.defaultShaderHeader;

    public macro: MacroRegistry;

    constructor(public gl: WebGLRenderingContext) {
        super();
        this.macro = new MacroRegistry();
    }

    /**
     * Instanciate specified material.
     * @param typeName 
     */
    public async instanciate(typeName: string): Promise<Material> {
        const generator = await MaterialFactory.materialGeneratorResolver.get(typeName);
        return generator(this);
    }

    /** 
     * Instanciate default material
    */
    public async instanciateDefault(): Promise<Material> {
        return this.instanciate(MaterialFactory.defaultMaterialName);
    }
}
