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

export default class RenderCubemapComponent extends RenderStageBase {
    public static componentName = "RenderCubemapComponent";
    public static attributes = {
        indexGroup: {
            default: "default",
            converter: StringConverter,
        },
        technique: {
            default: "default",
            converter: StringConverter,
        },
        layer: {
            default: "default",
            converter: StringConverter,
        },
        out: {
            default: null,
            converter: RenderingTargetConverter,
        },
        camera: {
            default: "cube-camera",
            converter: ComponentConverter,
            target: "CubemapCamera",
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

    public indexGroup!: string;

    public technique!: string;

    public out!: ICubemapRenderingTarget;

    public camera!: CubemapCameraComponent;

    public layer!: string;

    public clearColor!: Color4;

    public clearColorEnabled!: boolean;

    public clearDepth!: number;

    public clearDepthEnabled!: boolean;

    private _gl!: WebGLRenderingContext;

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
