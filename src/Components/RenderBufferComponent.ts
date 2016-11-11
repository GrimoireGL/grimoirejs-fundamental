import gr from "grimoirejs";
import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import RenderBuffer from "../Resource/RenderBuffer";
const Component = gr.Node.Component;
const IAttributeDeclaration = gr.Node.IAttributeDeclaration;

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
    if (!this.getValue("name")) {
      throw new Error(`Attribute 'name' must be specified.`);
    }
    this.buffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, arg.widthPowerOf2, arg.heightPowerOf2);
    arg.buffers[this.getValue("name")] = this.buffer;
  }
}
