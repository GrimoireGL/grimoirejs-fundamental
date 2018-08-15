import Vector2 from "grimoirejs-math/ref/Vector2";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IResizeViewportMessage from "../../Messages/IResizeViewportMessage";
import RendererComponent from "../RendererComponent";
import ResourceResizerComponentBase from "./ResourceResizerComponentBase";
import { Vector2Converter } from "grimoirejs-math/ref/Converters/Vector2Converter";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { attribute } from "grimoirejs/ref/Core/Decorator";

/**
 * Resource resizer that resizes all of ResizableResourceUpdator bounded to this node.
 * This resource resizer will resize these by considering viewport size.
 */
export default class ViewportSizeResourceResizer extends ResourceResizerComponentBase {
  public static componentName = "ViewportSizeResourceResizer";

  /**
   * Scale factor of texture resolution.
   */
  @attribute(Vector2Converter, "1")
  public resolutionScale!: Vector2;


  protected $mount(): void {
    const renderer = this.node.getComponentInAncestor(RendererComponent);
    this.__resizeResources(renderer.viewport.Width, renderer.viewport.Height);
  }

  protected $resizeViewport(arg: IResizeViewportMessage): void {
    const scale = this.resolutionScale;
    this.__resizeResources(arg.width * scale.X, arg.height * scale.Y);
  }
}
