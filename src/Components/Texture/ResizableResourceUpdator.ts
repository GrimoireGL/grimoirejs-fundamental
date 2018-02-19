import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import BasicComponent from "../BasicComponent";
import ConstantSizeResourceResizer from "./ConstantSizeResourceResizer";
import ResourceResizerComponentBase from "./ResourceResizerComponentBase";
import ViewportSizeResourceResizer from "./ViewportSizeResourceResizer";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { attribute, watch } from "grimoirejs/ref/Core/Decorator";

/**
 * Abstract class of ResizableResource container.
 */
export default class ResizableResourceUpdator extends BasicComponent {
    public static componentName = "ResizableResourceUpdator";
    public static resizers: { [key: string]: typeof ResourceResizerComponentBase } = {
        ViewportSize: ViewportSizeResourceResizer,
        Constant: ConstantSizeResourceResizer,
    };

    /**
     * Resizer type of resource.
     * ViewportSize or Constant is typically used.
     * If you needs to implement your own resizer, you can insert new resizer into ResizableResourceUpdator.resizers manually.
     */
    @attribute(StringConverter, "Constant")
    public resizerType!: string;

    /**
     * Resize texture buffer
     * @param width
     * @param height
     */
    public resize(width: number, height: number): void {
        // Nothing to do here. Resize features are depends on what resouces are managed by for each classes.
        // These should be considered by the classes override this class.
    }
    //TODO: Update for dynamic resizerType change
    protected $awake(): void {
        const resizer = this.node.getComponent(ResourceResizerComponentBase, false);
        if (!resizer) {
            const resizerCtor = ResizableResourceUpdator.resizers[this.resizerType];
            if (!resizerCtor) {
                throw new Error(`Specified resizer '${this.resizerType}' is not yet registered to resizable resource updator`);
            }
            setImmediate(() => {
                this.node.addComponent(resizerCtor); // darkside
            });
        }
    }
}
