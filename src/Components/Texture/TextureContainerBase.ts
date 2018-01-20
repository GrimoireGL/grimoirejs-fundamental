import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Texture from "../../Resource/Texture";
export default class TextureContainerBase<T extends Texture> extends Component {
    public static componentName = "TextureContainerBase";
    public static attributes = {
        minFilter: {
            converter: "Enum",
            default: "LINEAR",
            table: {
                LINEAR: WebGLRenderingContext.LINEAR,
                NEAREST: WebGLRenderingContext.NEAREST,
                NEAREST_MIPMAP_NEAREST: WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,
                NEAREST_MIPMAP_LINEAR: WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,
                LINEAR_MIPMAP_NEAREST: WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,
                LINEAR_MIPMAP_LINEAR: WebGLRenderingContext.LINEAR_MIPMAP_LINEAR,
            },
        },
        magFilter: {
            converter: "Enum",
            default: "LINEAR",
            table: {
                LINEAR: WebGLRenderingContext.LINEAR,
                NEAREST: WebGLRenderingContext.NEAREST,
            },
        },
        wrapS: {
            converter: "Enum",
            default: "REPEAT",
            table: {
                REPEAT: WebGLRenderingContext.REPEAT,
                MIRRORED_REPEAT: WebGLRenderingContext.MIRRORED_REPEAT,
                CLAMP_TO_EDGE: WebGLRenderingContext.CLAMP_TO_EDGE,
            },
        },
        wrapT: {
            converter: "Enum",
            default: "REPEAT",
            table: {
                REPEAT: WebGLRenderingContext.REPEAT,
                MIRRORED_REPEAT: WebGLRenderingContext.MIRRORED_REPEAT,
                CLAMP_TO_EDGE: WebGLRenderingContext.CLAMP_TO_EDGE,
            },
        },
    };

    public texture: T;

    public magFilter: number;

    public minFilter: number;

    public wrapS: number;

    public wrapT: number;

    protected $mount(): void {
        this.__bindAttributes();
        this.texture = this.__createTexture(this.companion.get("gl")!);
        this.__applyParameters();
        this.getAttributeRaw(TextureContainerBase.attributes.magFilter)!.watch(() => this.__applyParameters());
        this.getAttributeRaw(TextureContainerBase.attributes.minFilter)!.watch(() => this.__applyParameters());
        this.getAttributeRaw(TextureContainerBase.attributes.wrapS)!.watch(() => this.__applyParameters());
        this.getAttributeRaw(TextureContainerBase.attributes.wrapT)!.watch(() => this.__applyParameters());
    }

    protected $destroy(): void {
        this.texture.destroy();
        delete this.texture;
    }

    protected __createTexture(gl: WebGLRenderingContext): T {
        throw new Error(`This method should be overriden. But called directly.`);
    }

    protected __applyParameters(): void {
        this.texture.magFilter = this.getAttribute("magFilter");
        this.texture.minFilter = this.getAttribute("minFilter");
        this.texture.wrapT = this.getAttribute("wrapT");
        this.texture.wrapS = this.getAttribute("wrapS");
    }
}
