import GrimoireJS from "grimoirejs";
import Color4 from "grimoirejs-math/ref/Color4";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderingTarget from "../../Resource/RenderingTarget/IRenderingTarget";
import RenderStageBase from "./RenderStageBase";
import { RenderingTargetConverter } from "../../Converters/RenderingTargetConverter";
import { StandardAttribute, LazyAttribute } from "grimoirejs/ref/Core/Attribute";
import { Color4Converter } from "grimoirejs-math/ref/Converters/Color4Converter";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import { NumberConverter } from "grimoirejs/ref/Converter/NumberConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { attribute } from "grimoirejs/ref/Core/Decorator";
/** 
 * Base class of a render stage that render to only single texture.
*/
export default class SingleBufferRenderStageBase extends RenderStageBase {
    public static componentName = "SingleBufferRenderStageBase";
    /**
     * Clear color of buffer for every rendering loop
     */
    @attribute(Color4Converter, "#0000")
    public clearColor!: Color4;
    /**
     * Flag to enable/disable clearing color of buffer
     */
    @attribute(BooleanConverter, true)
    public clearColorEnabled!: boolean;
    /**
     * Clear depth of buffer for every rendeirng loop
     */
    @attribute(NumberConverter, 1)
    public clearDepth!: number;
    /**
     * Flag to enable/disable clearing depth of buffer.
     */
    @attribute(BooleanConverter, true)
    public clearDepthEnabled!: boolean;
    /**
     * A buffer to render.
     */
    @attribute(RenderingTargetConverter, "default")
    public out!: IRenderingTarget;
    /**
     * Setup rendering target(Attaching FBO, clearning depth or color buffers)
     */
    protected __beforeRender(): boolean {
        if (!super.__beforeRender()) {
            return false;
        }
        if (this.getAttributeRaw("out").isPending || !this.out) {
            return false;
        }
        let clearFlag = 0;
        if (this.clearColorEnabled) {
            clearFlag |= WebGLRenderingContext.COLOR_BUFFER_BIT;
        }
        if (this.clearDepthEnabled) {
            clearFlag |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
        }
        this.out.beforeDraw(clearFlag, Array.from(this.clearColor.rawElements), this.clearDepth);
        return true;
    }
}
