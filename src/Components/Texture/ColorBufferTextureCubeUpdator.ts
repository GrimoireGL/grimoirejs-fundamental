import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import RenderingBufferResourceRegistry from "../../Resource/RenderingTarget/RenderingBufferResourceRegistry";
import TextureCube from "../../Resource/TextureCube";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import EnumConverter from "grimoirejs/ref/Converter/EnumConverter";
import { StandardAttribute } from "grimoirejs/ref/Core/Attribute";

export default class ColorBufferTextureCubeUpdator extends TextureUpdatorComponentBase<TextureCube> {
    public static componentName = "ColorBufferTextureCubeUpdator";
    public static attributes = {
        name: {
            converter: StringConverter,
            default: null,
        },
        format: {
            converter: EnumConverter,
            default: WebGLRenderingContext.RGBA,
            table: {
                RGBA: WebGLRenderingContext.RGBA,
                RGB: WebGLRenderingContext.RGB,
                ALPHA: WebGLRenderingContext.ALPHA,
                LUMINANCE: WebGLRenderingContext.LUMINANCE,
                LUMINANCE_ALPHA: WebGLRenderingContext.LUMINANCE_ALPHA,
                SRGB_EXT: (WebGLRenderingContext as any)["SRGB_EXT"],
                SRGB_ALPHA_EXT: (WebGLRenderingContext as any)["SRGB_ALPHA_EXT"],
                DEPTH_COMPONENT: WebGLRenderingContext.DEPTH_COMPONENT,
                DEPTH_STENCIL: WebGLRenderingContext.DEPTH_STENCIL,
            },
        },
        type: {
            converter: EnumConverter,
            default: WebGLRenderingContext.UNSIGNED_BYTE,
            table: {
                UNSIGNED_BYTE: WebGLRenderingContext.UNSIGNED_BYTE,
                UNSIGNED_SHORT_5_6_5: WebGLRenderingContext.UNSIGNED_SHORT_5_6_5,
                UNSIGNED_SHORT_4_4_4_4: WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4,
                UNSIGNED_SHORT_5_5_5_1: WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1,
                UNSIGNED_SHORT: WebGLRenderingContext.UNSIGNED_SHORT,
                UNSIGNED_INT: WebGLRenderingContext.UNSIGNED_INT,
                FLOAT: WebGLRenderingContext.FLOAT,
            },
        },
        ...TextureUpdatorComponentBase.attributes
    };

    protected $awake(): void {
        super.$awake();
        const name = this.getAttribute(ColorBufferTextureCubeUpdator.attributes.name);
        const format = this.getAttribute(ColorBufferTextureCubeUpdator.attributes.format);
        const type = this.getAttribute(ColorBufferTextureCubeUpdator.attributes.type);
        if (name) {
            RenderingBufferResourceRegistry.get(this.companion.get("gl")!).setBackbuffer(this.getAttribute(ColorBufferTextureCubeUpdator.attributes.name), this.__texture);
        }
        this.__texture.updateDirectly(1, 1, {} as any, format, type, 0);
    }

    public resize(width: number, height: number): void {
        const format = this.getAttribute(ColorBufferTextureCubeUpdator.attributes.format);
        const type = this.getAttribute(ColorBufferTextureCubeUpdator.attributes.type);
        this.__texture.updateDirectly(width, height, {} as any, format, type, 0);
    }
}
