import FrameBuffer from "../FrameBuffer";
import RenderBuffer from "../RenderBuffer";
import Texture2D from "../Texture2D";
import Viewport from "../Viewport";
import IRenderingTarget from "./IRenderingTarget";
import GLStateConfigurator from "../../Material/GLStateConfigurator";
/**
 * Render target contains texture and render buffer
 */
export default class OffscreenRenderTarget implements IRenderingTarget {
    public readonly fbo: FrameBuffer;

    public get texture(): Texture2D {
        return this.textures[0];
    }

    constructor(public gl: WebGLRenderingContext, public textures: Texture2D[], public depthBuffer?: RenderBuffer) {
        if (textures.length === 0) {
            throw new Error("Textures must contain 1 texture at least");
        }
        this.fbo = new FrameBuffer(gl);
        for (let i = 0; i < textures.length; i++) {
            this.fbo.update(this.textures[i], 0, i);
        }
        if (depthBuffer) {
            this.fbo.update(depthBuffer);
        }
    }

    public beforeDraw(clearFlag: number, color: number[], depth: number): void {
        this.bind();
        if (clearFlag !== 0) {
            let clearTarget = 0;
            const gc = GLStateConfigurator.get(this.gl);
            gc.applyGLFlagIfChanged(WebGLRenderingContext.SCISSOR_TEST, false);
            if ((clearFlag & WebGLRenderingContext.COLOR_BUFFER_BIT) !== 0 && color) {
                gc.applyIfChanged("clearColor", color[0], color[1], color[2], color[3]);
                clearTarget |= WebGLRenderingContext.COLOR_BUFFER_BIT;
            }
            if ((clearFlag & WebGLRenderingContext.DEPTH_BUFFER_BIT) !== 0 && depth !== null && this.depthBuffer) {
                gc.applyIfChanged("clearDepth", depth);
                clearTarget |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
            }
            if (clearTarget !== 0) {
                this.gl.clear(clearTarget);
            }
        }
        this.getViewport().configure(this.gl);
    }
    public getBufferWidth(): number {
        return this.texture.width;
    }
    public getBufferHeight(): number {
        return this.texture.height;
    }
    public getViewport(): Viewport {
        return new Viewport(0, 0, this.getBufferWidth(), this.getBufferHeight());
    }

    public bind(): void {
        this.fbo.bind();
    }

}
