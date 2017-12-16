import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import RenderBuffer from "../../Resource/RenderBuffer";
import RenderingBufferResourceRegistry from "../../Resource/RenderingTarget/RenderingBufferResourceRegistry";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
export default class RenderBufferComponent extends ResizableResourceUpdator {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    name: {
      converter: "String",
      default: null,
    },
  };

  public buffer: RenderBuffer;

  protected $awake(): void {
    super.$awake();
    this.buffer = new RenderBuffer(this.companion.get("gl"));
    this.buffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, 1, 1);
    const name = this.getAttribute("name");
    if (name) {
      RenderingBufferResourceRegistry.get(this.companion.get("gl")).setDepthBuffer(name, this.buffer);
    }
  }

  protected $unmount(): void {
    this.buffer.destroy();
    this.buffer = null;
  }

  public resize(width: number, height: number): void {
    this.buffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, width, height);
  }
}
