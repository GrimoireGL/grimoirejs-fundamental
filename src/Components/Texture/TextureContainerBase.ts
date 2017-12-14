import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Texture from "../../Resource/Texture";
export default class TextureContainerBase<T extends Texture> extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
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

    public $mount(): void {
        this.__bindAttributes();
        this.texture = this.__createTexture(this.companion.get("gl"));
        this.__applyParameters();
        this.getAttributeRaw("magFilter").watch(() => this.__applyParameters());
        this.getAttributeRaw("minFilter").watch(() => this.__applyParameters());
        this.getAttributeRaw("wrapS").watch(() => this.__applyParameters());
        this.getAttributeRaw("wrapT").watch(() => this.__applyParameters());
    }

    public $destroy(): void {
        this.texture.destroy();
        this.texture = null;
    }

    protected __createTexture(gl: WebGLRenderingContext): T {
        return null;
    }

    protected __applyParameters(): void {
        this.texture.magFilter = this.getAttribute("magFilter");
        this.texture.minFilter = this.getAttribute("minFilter");
        this.texture.wrapT = this.getAttribute("wrapT");
        this.texture.wrapS = this.getAttribute("wrapS");
    }
}
