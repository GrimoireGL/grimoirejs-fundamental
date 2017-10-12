import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import BasicComponent from "../BasicComponent";
import ConstantSizeResourceResizer from "./ConstantSizeResourceResizer";
import ResourceResizerComponent from "./ResourceResizerComponentBase";
import ViewportSizeResourceResizer from "./ViewportSizeResourceResizer";
/**
 * Abstract class of ResizableResource container.
 */
export default class ResizableResourceUpdator extends BasicComponent {
  public static resizers: { [key: string]: typeof ResourceResizerComponent } = {
    ViewportSize: ViewportSizeResourceResizer,
    Constant: ConstantSizeResourceResizer,
  };

  public static attributes: { [key: string]: IAttributeDeclaration } = {
    resizerType: {
      converter: "String",
      default: "ViewportSize",
    },
  };

  /**
   * Resize texture buffer
   * @param width
   * @param height
   */
  public resize(width: number, height: number): void {
    throw new Error("Invalid calling of resize function. This should be overrided in extended classes.");
  }

  protected $awake(): void {
    const resizer = this.node.getComponent(ResourceResizerComponent);
    if (!resizer) {
      const resizerType = this.getAttribute("resizerType");
      const resizerCtor = ResizableResourceUpdator.resizers[resizerType];
      if (!resizerCtor) {
        throw new Error(`Specified resizer '${resizerType}' is not yet registered to resizable resource updator`);
      }
      setImmediate(() => {
        this.node.addComponent(resizerCtor); // darkside
      });
    }
  }

}
