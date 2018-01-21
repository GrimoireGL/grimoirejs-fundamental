import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import BasicComponent from "../BasicComponent";
import ConstantSizeResourceResizer from "./ConstantSizeResourceResizer";
import ResourceResizerComponentBase from "./ResourceResizerComponentBase";
import ViewportSizeResourceResizer from "./ViewportSizeResourceResizer";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";

/**
 * Abstract class of ResizableResource container.
 */
export default class ResizableResourceUpdator extends BasicComponent {
    public static componentName = "ResizableResourceUpdator";
    public static resizers: { [key: string]: typeof ResourceResizerComponentBase } = {
        ViewportSize: ViewportSizeResourceResizer,
        Constant: ConstantSizeResourceResizer,
    };

    public static attributes = {
        resizerType: {
            converter: StringConverter,
            default: "Constant",
        },
    };

    /**
     * Resize texture buffer
     * @param width
     * @param height
     */
    public resize(width: number, height: number): void {
        // Nothing to do here. Resize features are depends on what resouces are managed by for each classes.
        // These should be considered by the classes override this class.
    }

    protected $awake(): void {
        const resizer = this.node.getComponent(ResourceResizerComponentBase);
        if (!resizer) {
            const resizerType = this.getAttribute(ResizableResourceUpdator.attributes.resizerType);
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
