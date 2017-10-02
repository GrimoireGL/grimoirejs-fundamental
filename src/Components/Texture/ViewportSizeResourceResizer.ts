import Component from "grimoirejs/ref/Node/Component";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import Vector2 from "grimoirejs-math/ref/Vector2";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IResizeViewportMessage from "../../Messages/IResizeViewportMessage";
import ResourceResizerComponentBase from "./ResourceResizerComponentBase";
import TextureSizeCalculator from "../../Util/TextureSizeCalculator";

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


  public $resizeViewport(arg: IResizeViewportMessage): void {
    const scale = this.getAttribute("resolutionScale") as Vector2;
    const keep = this.getAttribute("keepPow2Size") as boolean;
    const newSize = keep ? TextureSizeCalculator.getPow2Size(arg.width * scale.X, arg.height * scale.Y) : { width: arg.width * scale.X, height: arg.height * scale.Y };
    this.node.getComponents(ResizableResourceUpdator)
      .forEach(resizable => resizable.resize(newSize.width, newSize.height));
  }
}
