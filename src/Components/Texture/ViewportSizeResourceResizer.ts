import Component from "grimoirejs/ref/Node/Component";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import Vector2 from "grimoirejs-math/ref/Vector2";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IResizeViewportMessage from "../../Messages/IResizeViewportMessage";
import ResourceResizerComponentBase from "./ResourceResizerComponentBase";
import TextureSizeCalculator from "../../Util/TextureSizeCalculator";
import RendererComponent from "../RendererComponent";

/**
 * Resource resizer that resizes all of ResizableResourceUpdator bounded to this node.
 * This resource resizer will resize these by considering viewport size.
 */
export default class ViewportSizeResourceResizer extends ResourceResizerComponentBase {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    resolutionScale: {
      converter: "Vector2",
      default: "1"
    },
    keepPow2Size: {
      converter: "Boolean",
      default: true
    }
  };

  public $mount(): void {
    const renderer = this.node.getComponentInAncestor(RendererComponent);
    if (renderer) {
      this.__resizeResources(renderer.viewport.Width, renderer.viewport.Height);
    } else {
      throw new Error("Resizable resource with ViewportSizeResourceResizer must be child of RendererComponent");
    }
  }

  public $resizeViewport(arg: IResizeViewportMessage): void {
    const scale = this.getAttribute("resolutionScale") as Vector2;
    this.__resizeResources(arg.width * scale.X, arg.height * scale.Y);
  }
}
