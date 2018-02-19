import Color4 from "grimoirejs-math/ref/Color4";
import Color4Converter from "grimoirejs-math/ref/Converters/Color4Converter";
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
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import { ComponentConverter } from "grimoirejs/ref/Converter/ComponentConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { NumberConverter } from "grimoirejs/ref/Converter/NumberConverter";
import { StandardAttribute, LazyAttribute } from "grimoirejs/ref/Core/Attribute";
import Component from "grimoirejs/ref/Core/Component";
import { RenderingTargetConverter } from "../../Converters/RenderingTargetConverter";
import IRenderingTarget from "../../Resource/RenderingTarget/IRenderingTarget";
import { attribute, companion } from "grimoirejs/ref/Core/Decorator";
export default class RenderCubemapComponent extends RenderStageBase {
    public static componentName = "RenderCubemapComponent";

    @attribute(StringConverter, "default")
    public indexGroup!: string;

    @attribute(StringConverter, "default")
    public technique!: string;

    @attribute(StringConverter, "default")
    public layer!: string;

    @attribute(RenderingTargetConverter, null)
    public out!: ICubemapRenderingTarget;

    @attribute(ComponentConverter, "cube-camera", { target: "CubemapCamera" })
    public camera!: CubemapCameraComponent;

    @attribute(Color4Converter, "#0000")
    public clearColor!: Color4;

    @attribute(BooleanConverter, true)
    public clearColorEnabled!: boolean;

    @attribute(NumberConverter, 1)
    public clearDepth!: number;

    @attribute(BooleanConverter, true)
    public clearDepthEnabled!: boolean;

    @companion("gl")
    private _gl!: WebGLRenderingContext;

    protected $renderRenderStage(args: IRenderRendererMessage): void {
        if (!this.__beforeRender()) {
            return;
        }
        if (!this.camera || !this.out) {
            return;
        }
        this.camera.updateContainedScene(args.timer);
        for (const direction in TextureCube.imageDirections) {
            this.out.beforeDraw(GLConstantUtility.createClearFilter(this.clearColorEnabled, this.clearDepthEnabled), Array.from(this.clearColor.rawElements), this.clearDepth, direction);
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
