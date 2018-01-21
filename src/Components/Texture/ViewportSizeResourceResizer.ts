import Vector2 from "grimoirejs-math/ref/Vector2";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IResizeViewportMessage from "../../Messages/IResizeViewportMessage";
import RendererComponent from "../RendererComponent";
import ResourceResizerComponentBase from "./ResourceResizerComponentBase";
import { Vector2Converter } from "grimoirejs-math/ref/Converters/Vector2Converter";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import Identity from "grimoirejs/ref/Core/Identity";

/**
 * Resource resizer that resizes all of ResizableResourceUpdator bounded to this node.
 * This resource resizer will resize these by considering viewport size.
 */
export default class ViewportSizeResourceResizer extends ResourceResizerComponentBase {
  public static componentName = "ViewportSizeResourceResizer";
  public static attributes = {
    resolutionScale: {
      converter: Vector2Converter,
      default: "1",
    },
    keepPow2Size: {
      converter: BooleanConverter,
      default: true,
    },
  };

  protected $mount(): void {
    const renderer = this.node.getComponentInAncestor(RendererComponent);
    if (renderer) {
      this.__resizeResources(renderer.viewport.Width, renderer.viewport.Height);
    } else {
      throw new Error("Resizable resource with ViewportSizeResourceResizer must be child of RendererComponent");
    }
  }

  protected $resizeViewport(arg: IResizeViewportMessage): void {
    const scale = this.getAttribute(ViewportSizeResourceResizer.attributes.resolutionScale) as Vector2;
    this.__resizeResources(arg.width * scale.X, arg.height * scale.Y);
  }
}
