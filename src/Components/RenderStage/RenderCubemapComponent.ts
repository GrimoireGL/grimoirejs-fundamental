import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IRenderRendererMessage from "../../Messages/IRenderRendererMessage";
import FrameBuffer from "../../Resource/FrameBuffer";
import IElementOfCubemapDirection from "../../Resource/IElementOfCubemapDirection";
import RenderBuffer from "../../Resource/RenderBuffer";
import TextureCube from "../../Resource/TextureCube";
import Viewport from "../../Resource/Viewport";
import CubemapCameraComponent from "../CubemapCameraComponent";
import RenderStageBase from "./RenderStageBase";
export default class RenderCubemapComponent extends RenderStageBase {
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
            converter: "TextureCube",
        },
        useDepth: {
            default: false,
            converter: "Boolean",
        },
        camera: {
            default: "cube-camera",
            converter: "Component",
            target: "CubemapCamera",
        },
    };

    public indexGroup: string;

    public technique: string;

    public out: TextureCube;

    public useDepth: boolean;

    public camera: CubemapCameraComponent;

    public layer: string;

    private _gl: WebGLRenderingContext;

    private _framebuffers: IElementOfCubemapDirection<FrameBuffer>;

    private _renderBuffer: RenderBuffer;

    public $mount(): void {
        this.__bindAttributes();
        this._gl = this.companion.get("gl");
        this.getAttributeRaw("out").watch((out: TextureCube) => {
            this._updateFramebuffers(out, this.useDepth);
        });
        this.getAttributeRaw("useDepth").watch((useDepth: boolean) => {
            this._updateFramebuffers(this.out, useDepth);
        }, true);
    }

    public $render(args: IRenderRendererMessage): void {
        if (!this.__beforeRender()) {
            return;
        }
        if (!this.camera || !this.out) {
            return;
        }
        this.camera.updateContainedScene(args.timer);
        // TODO: treat as attribute
        this._gl.viewport(0, 0, this.out.width, this.out.height);
        this._gl.clearColor(1, 0, 1, 1);
        for (const direction in TextureCube.imageDirections) {
            const fb = this._framebuffers[direction] as FrameBuffer;
            fb.bind();
            this._gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
            this._gl.flush();
            this.camera.direction = direction;
            this.camera.renderScene({
                renderer: this,
                camera: this.camera,
                layer: this.layer,
                viewport: new Viewport(0, 0, this.out.width, this.out.height),
                timer: args.timer,
                technique: this.technique,
                sceneDescription: {},
                rendererDescription: this.rendererDescription,
            });
        }
        this._gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
    }

    private _updateFramebuffers(out: TextureCube, useDepth: boolean): void {
        if (out) {
            if (!this._framebuffers) {
                this._framebuffers = {} as any;
            }
            for (const direction in TextureCube.imageDirections) {
                if (!this._framebuffers[direction]) {
                    this._framebuffers[direction] = new FrameBuffer(this._gl);
                }
                const fb = (this._framebuffers[direction] as FrameBuffer);
                fb.setMetadata("direction", direction);
                fb.update(out, TextureCube.imageDirections[direction]);
                if (useDepth) {
                    if (!this._renderBuffer) {
                        this._renderBuffer = new RenderBuffer(this._gl);
                        this._renderBuffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, out.width, out.height);
                    }
                    fb.update(this._renderBuffer);
                }
            }
        }
    }
}
