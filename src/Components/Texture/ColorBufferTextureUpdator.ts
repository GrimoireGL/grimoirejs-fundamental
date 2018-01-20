import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import RenderingBufferResourceRegistry from "../../Resource/RenderingTarget/RenderingBufferResourceRegistry";
import Texture2D from "../../Resource/Texture2D";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";
export default class ColorBufferTextureUpdator extends TextureUpdatorComponentBase<Texture2D> {
  public static componentName = "ColorBufferTextureUpdator";
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    name: {
      converter: "String",
      default: null,
    },
    format: {
      converter: "Enum",
      default: WebGLRenderingContext.RGBA,
      table: {
        RGBA: WebGLRenderingContext.RGBA,
        RGB: WebGLRenderingContext.RGB,
        ALPHA: WebGLRenderingContext.ALPHA,
        LUMINANCE: WebGLRenderingContext.LUMINANCE,
        LUMINANCE_ALPHA: WebGLRenderingContext.LUMINANCE_ALPHA,
        SRGB_EXT: WebGLRenderingContext["SRGB_EXT"],
        SRGB_ALPHA_EXT: WebGLRenderingContext["SRGB_ALPHA_EXT"],
        DEPTH_COMPONENT: WebGLRenderingContext["DEPTH_COMPONENT"],
        DEPTH_STENCIL: WebGLRenderingContext["DEPTH_STENCIL"],
      },
    },
    type: {
      converter: "Enum",
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
  };

  protected $awake(): void {
    super.$awake();
    const name = this.getAttribute("name");
    const format = this.getAttribute("format");
    const type = this.getAttribute("type");
    if (name) {
      RenderingBufferResourceRegistry.get(this.companion.get("gl")).setBackbuffer(this.getAttribute("name"), this.__texture);
    }
    this.__texture.update(0, 1, 1, 0, format, type, null);
  }

  public resize(width: number, height: number): void {
    const format = this.getAttribute("format");
    const type = this.getAttribute("type");
    this.__texture.update(0, width, height, 0, format, type, null);
  }
}
