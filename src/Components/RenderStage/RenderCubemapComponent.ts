import Color4 from "grimoirejs-math/ref/Color4";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderRendererMessage from "../../Messages/IRenderRendererMessage";
import FrameBuffer from "../../Resource/FrameBuffer";
import IElementOfCubemapDirection from "../../Resource/IElementOfCubemapDirection";
import RenderBuffer from "../../Resource/RenderBuffer";
import ICubemapRenderingTarget from "../../Resource/RenderingTarget/ICubemapRenderingTarget";
import TextureCube from "../../Resource/TextureCube";
import Viewport from "../../Resource/Viewport";
import GLConstantUtility from "../../Util/GLConstantUtility";
import CubemapCameraComponent from "../CubemapCameraComponent";
import RenderStageBase from "./RenderStageBase";
export default class RenderCubemapComponent extends RenderStageBase {
    public static componentName = "RenderCubemapComponent";
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        indexGroup: {
            default: "default",
            converter: "String",
        },
        technique: {
            default: "default",
            converter: "String",
        },
        layer: {
            default: "default",
            converter: "String",
        },
        out: {
            default: null,
            converter: "RenderingTarget",
        },
        camera: {
            default: "cube-camera",
            converter: "Component",
            target: "CubemapCamera",
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

    public indexGroup: string;

    public technique: string;

    public out: ICubemapRenderingTarget;

    public camera: CubemapCameraComponent;

    public layer: string;

    public clearColor: Color4;

    public clearColorEnabled: boolean;

    public clearDepth: number;

    public clearDepthEnabled: boolean;

    private _gl: WebGLRenderingContext;

    protected $mount(): void {
        this.__bindAttributes();
        this._gl = this.companion.get("gl")!;
    }

    protected $renderRenderStage(args: IRenderRendererMessage): void {
        if (!this.__beforeRender()) {
            return;
        }
        if (!this.camera || !this.out) {
            return;
        }
        this.camera.updateContainedScene(args.timer);
        for (const direction in TextureCube.imageDirections) {
            this.out.beforeDraw(GLConstantUtility.createClearFilter(this.clearColorEnabled, this.clearDepthEnabled), this.clearColor.rawElements as number[], this.clearDepth, direction);
            this.camera.direction = direction;
            this.camera.renderScene({
                renderer: this,
                camera: this.camera,
                layer: this.layer,
                viewport: this.out.getViewport(),
                timer: args.timer,
                technique: this.technique,
                sceneDescription: {},
                rendererDescription: this.rendererDescription,
            });
        }
        this._gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
    }
}
