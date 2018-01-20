import GrimoireJS from "grimoirejs";
import Color4 from "grimoirejs-math/ref/Color4";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderingTarget from "../../Resource/RenderingTarget/IRenderingTarget";
import RenderStageBase from "./RenderStageBase";
export default class SingleBufferRenderStageBase extends RenderStageBase {
    public static componentName = "SingleBufferRenderStageBase";
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        out: {
            converter: "RenderingTarget",
            default: "default",
        },
        clearColor: {
            default: "#0000",
            converter: "Color4",
        },
        clearColorEnabled: {
            default: true,
            converter: "Boolean",
        },
        clearDepthEnabled: {
            default: true,
            converter: "Boolean",
        },
        clearDepth: {
            default: 1,
            converter: "Number",
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
        this.out.beforeDraw(clearFlag, this.clearColor.rawElements as number[], this.clearDepth);
        return true;
    }
}
