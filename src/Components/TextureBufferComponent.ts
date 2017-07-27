import gr from "grimoirejs";
import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import Texture2D from "../Resource/Texture2D";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import TextureSizeCalculator from "../Util/TextureSizeCalculator";
import Viewport from "../Resource/Viewport";
export default class TextureBufferComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    name: {
      converter: "String",
      default: null
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
        DEPTH_STENCIL: WebGLRenderingContext["DEPTH_STENCIL"]
      }
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
        FLOAT: WebGLRenderingContext.FLOAT
      }
    }
  };

  public buffer: Texture2D;

  public $mount(): void {
    this.buffer = new Texture2D(this.companion.get("gl"));
  }

  public $unmount(): void {
    this.buffer.destroy();
    this.buffer = null;
  }

  public $resizeBuffer(arg: IResizeBufferMessage): void {
    const bufferName = this.getAttribute("name");
    if (!bufferName) {
      throw new Error(`Attribute 'name' must be specified.`);
    }
    const format = this.getAttribute("format");
    const type = this.getAttribute("type");
    const newSize = TextureSizeCalculator.getPow2Size(arg.width, arg.height);
    this.buffer.update(0, newSize.width, newSize.height, 0, format, type, null);
    arg.bufferViewports[bufferName] = new Viewport(0, 0, newSize.width, newSize.height);
    arg.buffers[bufferName] = this.buffer;
  }
}
