import Viewport from "../Viewport";
import IRenderingTarget from "./IRenderingTarget";
import GLStateConfigurator from "../../Material/GLStateConfigurator";

/**
 * Rendering target to render into canvas
 */
export default class CanvasRenderingTarget implements IRenderingTarget {
    public beforeDraw(clearFlag: number, color: number[], depth: number): void {
        this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
        if (clearFlag) {
            this.__configureClearScissor();
            const gc = GLStateConfigurator.get(this.gl);
            let clearTarget = 0;
            if ((clearFlag & WebGLRenderingContext.COLOR_BUFFER_BIT) !== 0 && color) {
                gc.applyIfChanged("clearColor", color[0], color[1], color[2], color[3]);
                clearTarget |= WebGLRenderingContext.COLOR_BUFFER_BIT;
            }
            if ((clearFlag & WebGLRenderingContext.DEPTH_BUFFER_BIT) !== 0 && depth !== null) {
                gc.applyIfChanged("clearDepth", depth);
                clearTarget |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
            }
            if (clearTarget !== 0) {
                this.gl.clear(clearTarget);
            }
            this.__endClearScissor();
        }
        this.getViewport().configure(this.gl);
    }
    /**
     * Actual buffer width of rendered buffer.
     * This value can't be changed by viewport.
     * Just depending on canvas size.
     */
    public getBufferWidth(): number {
        return this.gl.canvas.width;
    }
    /**
     * Actual buffer height of rendered buffer.
     * This value can't be changed by viewport.
     * Just depending on canvas size.
     */
    public getBufferHeight(): number {
        return this.gl.canvas.height;
    }
    public getViewport(): Viewport {
        return new Viewport(0, 0, this.getBufferWidth(), this.getBufferHeight());
    }

    protected __configureClearScissor(): void {
        this.gl.disable(WebGLRenderingContext.SCISSOR_TEST);
    }

    protected __endClearScissor(): void {
        return;
    }

    constructor(public gl: WebGLRenderingContext) {

    }
}
