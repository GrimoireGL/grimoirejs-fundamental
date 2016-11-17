import gr from "grimoirejs";
import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import Texture2D from "../Resource/Texture2D";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

export default class TextureBufferComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    name: {
      converter: "String",
      defaultValue: undefined
    },
    format: {
      converter: "Enum",
      defaultValue: WebGLRenderingContext.RGBA,
      table: {
        RGBA: WebGLRenderingContext.RGBA,
        RGB: WebGLRenderingContext.RGB
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
    if (!this.getValue("name")) {
      throw new Error(`Attribute 'name' must be specified.`);
    }
    this.buffer.update(0, arg.widthPowerOf2, arg.heightPowerOf2, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, null);
    arg.buffers[this.getValue("name")] = this.buffer;
  }
}
