import Viewport from "../Viewport";
import CanvasRenderingTarget from "./CanvasRenderingTarget";

/**
 * Rendering target of part of canvas.
 * This rendering target limit a region of canvas by viewport.
 */
export default class CanvasRegionRenderingTarget extends CanvasRenderingTarget {
    private _viewport: Viewport;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
    }

    public setViewport(viewport: Viewport): void {
        this._viewport = viewport;
    }

    public getViewport(): Viewport {
        return this._viewport;
    }

    protected __configureClearScissor(): void {
        this.gl.enable(WebGLRenderingContext.SCISSOR_TEST);
        const vp = this.getViewport();
        this.gl.scissor(vp.Left, vp.Bottom, vp.Width, vp.Height);
    }
}
