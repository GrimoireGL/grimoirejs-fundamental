import RendererComponent from "./RendererComponent";
import IRenderable from "../SceneRenderer/IRenderable";
import MeshIndexCalculator from "../Util/MeshIndexCalculator";
import ViewportMouseEvent from "../Objects/ViewportMouseEvent";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import Framebuffer from "../Resource/FrameBuffer";
import Texture2D from "../Resource/Texture2D";
import RenderBuffer from "../Resource/RenderBuffer";
import TextureSizeCalculator from "../Util/TextureSizeCalculator";
import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import RenderSceneComponent from "./RenderSceneComponent";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Component from "grimoirejs/ref/Node/Component";
export default class RenderHitareaComponent extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {

    };

    private _sceneRenderer: RenderSceneComponent;

    private _gl: WebGLRenderingContext;

    private _canvas: HTMLCanvasElement;

    private _lastPosition: number[];

    private _mouseInside: boolean;

    private _readCache: Uint8Array = new Uint8Array(4);

    private _bufferSize: number[];

    private _lastRenderable: IRenderable;

    private _mouseMoved: boolean;

    public hitareaTexture: Texture2D;

    public hitareaRenderbuffer: RenderBuffer;

    public hitareaFBO: Framebuffer;

    public $mount(): void {
        this._sceneRenderer = this.node.getComponent(RenderSceneComponent);
        if (!this._sceneRenderer) {
            throw new Error("The node attaching RenderHitArea should contain RenderScene.")
        }
        this._gl = this.companion.get("gl");
        this._canvas = this.companion.get("canvasElement");
        this.hitareaTexture = new Texture2D(this._gl);
        this.hitareaRenderbuffer = new RenderBuffer(this._gl);
        if (this.hitareaFBO) {
            this.hitareaFBO.destroy();
            this.hitareaFBO = null;
        }
    }

    public $resizeBuffer(args: IResizeBufferMessage): void {
        const size = TextureSizeCalculator.getPow2Size(args.width, args.height);
        this._bufferSize = [size.width, size.height];
        this.hitareaTexture.update(0, size.width, size.height, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE);
        this.hitareaRenderbuffer.update(WebGLRenderingContext.DEPTH_COMPONENT16, size.width, size.height);
        if (!this.hitareaFBO) {
            this.hitareaFBO = new Framebuffer(this._gl);
            this.hitareaFBO.update(this.hitareaTexture);
            this.hitareaFBO.update(this.hitareaRenderbuffer);
        }
    }

    public $render(args: IRenderRendererMessage): void {
        if (!this._mouseInside) {
            return;
        }
        this.hitareaFBO.bind();
        this._gl.viewport(0, 0, this._bufferSize[0], this._bufferSize[1]);
        // clear buffer if needed
        this._gl.clearColor(0, 0, 0, 0);
        this._gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
        this._gl.clearDepth(1);
        this._gl.clear(WebGLRenderingContext.DEPTH_BUFFER_BIT);
        args.camera.renderScene({
            renderer: this._sceneRenderer, // TODO
            camera: args.camera,
            buffers: args.buffers,
            layer: this._sceneRenderer.layer,
            viewport: args.viewport,
            loopIndex: args.loopIndex,
            technique: "hitarea"
        });
        this._gl.flush();
        this._gl.readPixels(this._lastPosition[0] * this._bufferSize[0], this._lastPosition[1] * this._bufferSize[1], 1, 1, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, this._readCache);
        const index = MeshIndexCalculator.fromColor(this._readCache);
        if (index === 0) {
            if (this._lastRenderable instanceof Component) {
                this._lastRenderable.node.emit("mouseleave", this._lastRenderable);
            }
            this._lastRenderable = null;
        } else {
            const r = args.camera.containedScene.queueRegistory.getByIndex(index - 1);
            if (this._lastRenderable !== r) {
                if (this._lastRenderable instanceof Component) {
                    this._lastRenderable.node.emit("mouseleave", this._lastRenderable);
                }
                if (r instanceof Component) {
                    r.node.emit("mouseenter", r);
                }
            } else {
                if (r instanceof Component) {
                    if (this._mouseMoved) {
                        r.node.emit("mousemove", r);
                    } else {
                        r.node.emit("mouseon", r);
                    }
                }
            }
            this._lastRenderable = r;
        }
        this._gl.bindFramebuffer(this._gl.FRAMEBUFFER, null);
    }

    public $mousemove(v: ViewportMouseEvent): void {
        this._lastPosition = [v.viewportNormalizedX, 1.0 - v.viewportNormalizedY];
        this._mouseMoved = true;
    }

    public $mouseenter(v: ViewportMouseEvent): void {
        this._mouseInside = true;
        this._lastPosition = [v.viewportNormalizedX, 1.0 - v.viewportNormalizedY];
        this._mouseMoved = true;
    }

    public $mouseleave(v: ViewportMouseEvent): void {
        this._mouseInside = false;
        this._lastPosition = [v.viewportNormalizedX, 1.0 - v.viewportNormalizedY];
        this._mouseMoved = true;
        if (this._lastRenderable instanceof Component) {
            this._lastRenderable.node.emit("mouseleave", this._lastRenderable);
        }
        this._lastRenderable = null;
    }
}
