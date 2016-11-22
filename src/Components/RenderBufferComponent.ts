import gr from "grimoirejs";
import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import RenderBuffer from "../Resource/RenderBuffer";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import TextureSizeCalculator from "../Util/TextureSizeCalculator";

export default class RenderBufferComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    name: {
      converter: "String",
      defaultValue: undefined
    }
  };

  public buffer: RenderBuffer;

  public $mount(): void {
    this.buffer = new RenderBuffer(this.companion.get("gl"));
  }

  public $unmount(): void {
    this.buffer.destroy();
    this.buffer = null;
  }

  public $resizeBuffer(arg: IResizeBufferMessage): void {
    const name = this.getValue("name");
    if (!name) {
      throw new Error(`Attribute 'name' must be specified.`);
    }
    const newSize = TextureSizeCalculator.getPow2Size(arg.width, arg.height);
    this.buffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, newSize.width, newSize.height);
    arg.bufferSizes[name] = { width: newSize.width, height: newSize.height };
    arg.buffers[name] = this.buffer;
  }
}
