import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import TextureSizeCalculator from "../../Util/TextureSizeCalculator";
import ResizableResourceUpdator from "./ResizableResourceUpdator";

/**
 * Base class of texture resizer
 */
export default class TextureResizerComponentBase extends Component {
  /**
   * no document
   */
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    keepPow2Size: {
      converter: "Boolean",
      default: true,
    },
  };

  private _lastWidth = 0;

  private _lastHeight = 0;

  /**
   * Resize all resources on this node.
   * @param width
   * @param height
   */
  protected __resizeResources(width: number, height: number): void {
    if (this.getAttribute("keepPow2Size")) {
      const newSize = TextureSizeCalculator.getPow2Size(width, height);
      width = newSize.width;
      height = newSize.height;
    }
    if (width === this._lastWidth && height === this._lastHeight) {
      return;
    }
    this.node.getComponents(ResizableResourceUpdator)
      .forEach(resizable => resizable.resize(width, height));
    this._lastWidth = width;
    this._lastHeight = height;
  }
}
