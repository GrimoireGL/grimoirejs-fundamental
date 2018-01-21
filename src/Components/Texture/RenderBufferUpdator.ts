import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import RenderBuffer from "../../Resource/RenderBuffer";
import RenderingBufferResourceRegistry from "../../Resource/RenderingTarget/RenderingBufferResourceRegistry";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";

export default class RenderBufferComponent extends ResizableResourceUpdator {
  public static componentName = "RenderBufferComponent";
  public static attributes= {
    name: {
      converter:StringConverter,
      default: null,
    },
  };

  public buffer: RenderBuffer;

  protected $awake(): void {
    super.$awake();
    const gl = this.companion.get("gl")!;
    this.buffer = new RenderBuffer(gl);
    this.buffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, 1, 1);
    const name = this.getAttribute(RenderBufferComponent.attributes.name);
    if (name) {
      RenderingBufferResourceRegistry.get(gl).setDepthBuffer(name, this.buffer);
    }
  }

  protected $unmount(): void {
    this.buffer.destroy();
    delete this.buffer;
  }

  public resize(width: number, height: number): void {
    this.buffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, width, height);
  }
}
