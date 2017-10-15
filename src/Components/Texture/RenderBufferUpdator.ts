import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import RenderBuffer from "../../Resource/RenderBuffer";
import RenderingBufferResourceRegistry from "../../Resource/RenderingTarget/RenderingBufferResourceRegistry";
import CanvasInitializerComponent from "../CanvasInitializerComponent";
import ResizableResourceUpdator from "./ResizableResourceUpdator";

/**
 * no document
 */
export default class RenderBufferUpdatorComponent extends ResizableResourceUpdator {
  public static componentName = "RenderBufferUpdator";
  /**
   * no document
   */
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    name: {
      converter: "String",
      default: null,
    },
  };

  /**
   * no document
   */
  public buffer: RenderBuffer;

  /**
   * no document
   * @param width
   * @param height
   */
  public resize(width: number, height: number): void {
    this.buffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, width, height);
  }

  protected $awake(): void {
    super.$awake();
    this.buffer = new RenderBuffer(this.companion.get(CanvasInitializerComponent.COMPANION_KEY_GL));
    this.buffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, 1, 1);
    const name = this.getAttribute("name");
    if (name) {
      RenderingBufferResourceRegistry.get(this.companion.get(CanvasInitializerComponent.COMPANION_KEY_GL)).setDepthBuffer(name, this.buffer);
    }
  }

  protected $unmount(): void {
    this.buffer.destroy();
    this.buffer = null;
  }

}
