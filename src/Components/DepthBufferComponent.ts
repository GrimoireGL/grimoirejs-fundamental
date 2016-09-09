import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import RenderBuffer from "../Resource/RenderBuffer";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";

export default class DepthBufferComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    name: {
      converter: "string",
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
    this.buffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, arg.width, arg.height);
    arg.buffers[this.getValue("name")] = this.buffer;
  }
}
