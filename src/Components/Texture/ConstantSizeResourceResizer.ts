import Vector2 from "grimoirejs-math/ref/Vector2";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import ResourceResizerComponentBase from "./ResourceResizerComponentBase";
import Vector2Converter from "grimoirejs-math/ref/Converters/Vector2Converter";
import Identity from "grimoirejs/ref/Core/Identity";
import { attribute, watch } from "grimoirejs/ref/Core/Decorator";

/**
 * Resource resizer that resizes all of ResizableResourceUpdator bounded to this node.
 * This resource resizer will resize by given resolution attribute.
 */
export default class ConstantSizeResourceResizer extends ResourceResizerComponentBase {
    public static componentName = "ConstantSizeResourceResizer";
    /**
     * Resolution of resource.
     * You can specify as Vector2 as "px".
     */
    @attribute(Vector2Converter, "512,512")
    public resolution!: Vector2;

    @watch("resolution", true)
    private _onResolutionChange(): void {
        this.__resizeResources(this.resolution.X, this.resolution.Y);
    }
}
