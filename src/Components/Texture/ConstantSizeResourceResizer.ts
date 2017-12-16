import Vector2 from "grimoirejs-math/ref/Vector2";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import ResourceResizerComponentBase from "./ResourceResizerComponentBase";

/**
 * Resource resizer that resizes all of ResizableResourceUpdator bounded to this node.
 * This resource resizer will resize by given resolution attribute.
 */
export default class ConstantSizeResourceResizer extends ResourceResizerComponentBase {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        resolution: {
            converter: "Vector2",
            default: "512,512",
        },
    };

    protected $mount(): void {
        this.getAttributeRaw("resolution").watch(n => {
            const res = n as Vector2;
            this.__resizeResources(res.X, res.Y);
        }, true);
    }
}
