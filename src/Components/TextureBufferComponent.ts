import gr from "grimoirejs";
import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import Texture2D from "../Resource/Texture2D";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import TextureSizeCalculator from "../Util/TextureSizeCalculator";
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
    const newSize = TextureSizeCalculator.getPow2Size(arg.width, arg.height);
    this.buffer.update(0, newSize.width, newSize.height, 0, format, WebGLRenderingContext.UNSIGNED_BYTE, null);
    arg.bufferSizes[bufferName] = { width: newSize.width, height: newSize.height };
    arg.buffers[bufferName] = this.buffer;
  }
}
