import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import Texture2D from "../Resource/Texture2D";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

export default class BackBufferComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    name: {
      converter: "string",
      defaultValue: undefined
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
    this.buffer.update(0, arg.width, arg.height, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, null);
    arg.buffers[this.getValue("name")] = this.buffer;
  }
}
