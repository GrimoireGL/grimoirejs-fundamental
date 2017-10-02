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
        },
        keepPow2Size: {
            converter: "Boolean",
            default: true
        }
    };

    private _currentSize: number[] = [1, 1];

    public $mount(): void {
        this.getAttributeRaw("resolution").watch(n => {
            const res = n as Vector2;
            const keep = this.getAttribute("keepPow2Size") as boolean;
            let size = keep ? TextureSizeCalculator.getPow2Size(res.X, res.Y) : { width: res.X, height: res.Y };
            if (this._currentSize[0] !== size.width || this._currentSize[1] !== size.height) {
                this.node.getComponents(ResizableResourceUpdator)
                    .forEach(resizable => resizable.resize(size.width, size.height));
                this._currentSize[0] = size.width;
                this._currentSize[1] = size.height;
            }
        }, true);
    }
}
