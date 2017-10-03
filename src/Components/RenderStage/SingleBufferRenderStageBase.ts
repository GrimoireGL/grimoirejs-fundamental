import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import RenderStageBase from "./RenderStageBase";
import Color4 from "grimoirejs-math/ref/Color4";
import IRenderingTarget from "../../Resource/RenderingTarget/IRenderingTarget";

export default class SingleBufferRenderStageBase extends RenderStageBase {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        out: {
            converter: "RenderingTarget",
            default: "default"
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
            default: 1.0,
            converter: "Number",
        }
    };

    public clearColor: Color4;

    public clearColorEnabled: boolean;

    public clearDepth: number;

    public clearDepthEnabled: boolean;

    public out: IRenderingTarget;

    public $awake(): void {
        this.getAttributeRaw("clearColor").boundTo("clearColor");
        this.getAttributeRaw("clearColorEnabled").boundTo("clearColorEnabled");
        this.getAttributeRaw("clearDepthEnabled").boundTo("clearDepthEnabled");
        this.getAttributeRaw("clearDepth").boundTo("clearDepth");
        this.getAttributeRaw("out").boundTo("out");
    }

    protected __beforeRender():void{
        let clearFlag = 0;
        if (this.clearColorEnabled) {
          clearFlag |= WebGLRenderingContext.COLOR_BUFFER_BIT;
        }
        if (this.clearDepthEnabled) {
          clearFlag |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
        }
        this.out.beforeDraw(clearFlag,this.clearColor.rawElements as number[],this.clearDepth);
    }
}