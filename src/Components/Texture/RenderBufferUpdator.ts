import gr from "grimoirejs";
import IResizeViewportMessage from "../../Messages/IResizeViewportMessage";
import RenderBuffer from "../../Resource/RenderBuffer";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import TextureSizeCalculator from "../../Util/TextureSizeCalculator";
import Viewport from "../../Resource/Viewport";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import RenderingBufferResourceRegistry from "../../Resource/RenderingTarget/RenderingBufferResourceRegistry";
export default class RenderBufferComponent extends ResizableResourceUpdator {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    name: {
      converter: "String",
      default: null
    }
  };

  public buffer: RenderBuffer;

  public $mount(): void {
    super.$mount();
    this.buffer = new RenderBuffer(this.companion.get("gl"));
    const name = this.getAttribute("name");
    if (name) {
      RenderingBufferResourceRegistry.get(this.companion.get("gl")).setDepthBuffer(name, this.buffer);
    }
  }

  public $unmount(): void {
    this.buffer.destroy();
    this.buffer = null;
  }

  public resize(width: number, height: number): void {
    this.buffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, width, height);
  }
}
