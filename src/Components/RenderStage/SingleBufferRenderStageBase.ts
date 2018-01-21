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

export default class SingleBufferRenderStageBase extends RenderStageBase {
    public static componentName = "SingleBufferRenderStageBase";
    public static attributes = {
        out: {
            default: "default",
            converter: RenderingTargetConverter,
        },
        clearColor: {
            default: "#0000",
            converter: Color4Converter,
        },
        clearColorEnabled: {
            default: true,
            converter: BooleanConverter,
        },
        clearDepthEnabled: {
            default: true,
            converter: BooleanConverter,
        },
        clearDepth: {
            default: 1,
            converter: NumberConverter,
        },
    };

    public clearColor: Color4;

    public clearColorEnabled: boolean;

    public clearDepth: number;

    public clearDepthEnabled: boolean;

    public _out: Promise<IRenderingTarget>;

    public out: IRenderingTarget;

    protected $awake(): void {
        this.__bindAttributes();
    }

    /**
     * Setup rendering target(Attaching FBO, clearning depth or color buffers)
     */
    protected __beforeRender(): boolean {
        if (!super.__beforeRender()) {
            return false;
        }
        if (!this.out) {
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
