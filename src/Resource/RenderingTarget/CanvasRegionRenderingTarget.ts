import Viewport from "../Viewport";
import CanvasRenderingTarget from "./CanvasRenderingTarget";
import GLStateConfigurator from "../../Material/GLStateConfigurator";

/**
 * Rendering target of part of canvas.
 * This rendering target limit a region of canvas by viewport.
 */
export default class CanvasRegionRenderingTarget extends CanvasRenderingTarget {
    private _viewport!: Viewport;

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
        const gc = GLStateConfigurator.get(this.gl);
        gc.applyGLFlagIfChanged(WebGLRenderingContext.SCISSOR_TEST, true);
        const vp = this.getViewport();
        gc.applyIfChanged("scissor", vp.Left, vp.Bottom, vp.Width, vp.Height);
    }

    protected __endClearScissor(): void {
        this.gl.disable(WebGLRenderingContext.SCISSOR_TEST);
    }
}
