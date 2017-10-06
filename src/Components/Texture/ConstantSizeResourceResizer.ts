import Component from "grimoirejs/ref/Node/Component";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import Vector2 from "grimoirejs-math/ref/Vector2";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IResizeViewportMessage from "../../Messages/IResizeViewportMessage";
import ResourceResizerComponentBase from "./ResourceResizerComponentBase";
import TextureSizeCalculator from "../../Util/TextureSizeCalculator";

/**
 * Resource resizer that resizes all of ResizableResourceUpdator bounded to this node.
 * This resource resizer will resize by given resolution attribute.
 */
export default class ConstantSizeResourceResizer extends ResourceResizerComponentBase {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        resolution: {
            converter: "Vector2",
            default: "512,512"
        }
    };

    public $mount(): void {
        this.getAttributeRaw("resolution").watch(n => {
            const res = n as Vector2;
            this.__resizeResources(res.X, res.Y);
        }, true);
    }
}
