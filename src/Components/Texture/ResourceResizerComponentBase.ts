import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import TextureSizeCalculator from "../../Util/TextureSizeCalculator";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import Identity from "grimoirejs/ref/Core/Identity";

/**
 * Base class of texture resizer
 */
export default class ResourceResizerComponentBase extends Component {
    public static componentName = "ResourceResizerComponentBase";
    public static attributes = {
        keepPow2Size: {
            converter: BooleanConverter,
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
        if (this.getAttribute(ResourceResizerComponentBase.attributes.keepPow2Size)) {
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
