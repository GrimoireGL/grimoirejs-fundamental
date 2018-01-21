import Vector2 from "grimoirejs-math/ref/Vector2";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import ResourceResizerComponentBase from "./ResourceResizerComponentBase";
import Vector2Converter from "grimoirejs-math/ref/Converters/Vector2Converter";
import Identity from "grimoirejs/ref/Core/Identity";

/**
 * Resource resizer that resizes all of ResizableResourceUpdator bounded to this node.
 * This resource resizer will resize by given resolution attribute.
 */
export default class ConstantSizeResourceResizer extends ResourceResizerComponentBase {
    public static componentName = "ConstantSizeResourceResizer";
    public static attributes = {
        ...ResourceResizerComponentBase.attributes,
        resolution: {
            converter: Vector2Converter,
            default: "512,512",
        },
    };

    protected $mount(): void {
        this.getAttributeRaw(ConstantSizeResourceResizer.attributes.resolution)!.watch(n => {
            const res = n as Vector2;
            this.__resizeResources(res.X, res.Y);
        }, true);
    }
}
