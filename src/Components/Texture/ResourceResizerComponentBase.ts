import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import TextureSizeCalculator from "../../Util/TextureSizeCalculator";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { attribute } from "grimoirejs/ref/Core/Decorator";

/**
 * Base class of texture resizer
 */
export default class ResourceResizerComponentBase extends Component {
    public static componentName = "ResourceResizerComponentBase";

    /**
     * Flag to keep POT(Power of 2) sized texture.
     * If this flag is true, this resizer automatically calculate suitable size that can be differ from the value user specified.
     */
    @attribute(BooleanConverter, true)
    public keepPow2Size!: boolean;

    private _lastWidth = 0;

    private _lastHeight = 0;

    /**
     * Resize all resources on this node.
     * @param width
     * @param height
     */
    protected __resizeResources(width: number, height: number): void {
        if (this.keepPow2Size) { // Recalculate POT size
            const newSize = TextureSizeCalculator.getPow2Size(width, height);
            width = newSize.width;
            height = newSize.height;
        }
        if (width === this._lastWidth && height === this._lastHeight) {
            return; // Nothing to do when texture size was not changed
        }
        this.node.getComponents(ResizableResourceUpdator)
            .forEach(resizable => resizable.resize(width, height));
        this._lastWidth = width;
        this._lastHeight = height;
    }
}
