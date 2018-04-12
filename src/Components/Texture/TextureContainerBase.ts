import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Texture from "../../Resource/Texture";
import { EnumConverter } from "grimoirejs/ref/Converter/EnumConverter";
import { StandardAttribute } from "grimoirejs/ref/Core/Attribute";
import GLConstantUtility from "../../Util/GLConstantUtility";
import { attribute, watch } from "grimoirejs/ref/Core/Decorator";

/**
 * An abstract component to hold referrence of Textures.
 */
export default class TextureContainerBase<T extends Texture> extends Component {
    public static componentName = "TextureContainerBase";
    /**
     * Texture mag filter
     */
    @attribute(EnumConverter, "LINEAR", "magFilter", { table: GLConstantUtility.textureMagFilterFromName })
    public magFilter!: number;
    /**
     * Texture min filter
     */
    @attribute(EnumConverter, "LINEAR", "minFilter", { table: GLConstantUtility.textureMinFilterFromName })
    public minFilter!: number;
    /**
     * Texture wrap filter of S coordinate.
     */
    @attribute(EnumConverter, "REPEAT", "wrapS", { table: GLConstantUtility.textureWrapFromName })
    public wrapS!: number;
    /**
     * Texture wrap filter of T coordinate.
     */
    @attribute(EnumConverter, "REPEAT", "wrapT", { table: GLConstantUtility.textureWrapFromName })
    public wrapT!: number;
    /**
     * Texture referrence to be managed.
     */
    public texture!: T;


    protected $mount(): void {
        this.texture = this.__createTexture(this.companion.get("gl")!);
        this.__applyParameters();
    }

    protected $destroy(): void {
        this.texture.destroy();
        delete this.texture;
    }

    /**
     * Create texture referrence using gl context.
     * @param gl context of WebGL
     */
    protected __createTexture(gl: WebGLRenderingContext): T {
        throw new Error(`This method should be overriden. But called directly.`);
    }


    protected __applyParameters(): void {
        this.texture.magFilter = this.magFilter;
        this.texture.minFilter = this.minFilter;
        this.texture.wrapT = this.wrapT;
        this.texture.wrapS = this.wrapS;
    }

    @watch("magFilter")
    @watch("minFilter")
    @watch("wrapT")
    @watch("wrapS")
    private _onTextureParameterChanged(): void {
        this.__applyParameters();
    }

}
