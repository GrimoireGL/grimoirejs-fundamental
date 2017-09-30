import IRenderingTarget from "./IRenderingTarget";
import Viewport from "../Viewport";

/**
 * Rendering target to render into canvas
 */
export default class CanvasRenderingTarget implements IRenderingTarget {
    public beforeDraw(clearFlag: number, color: number[], depth: number): void {
        this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
        if(clearFlag){
            this.__configureClearScissor();
            let clearTarget = 0;
            if (color !== null){
                this.gl.clearColor.apply(this.gl, color);
                clearTarget |= WebGLRenderingContext.COLOR_BUFFER_BIT;
            }
            if (depth !== null){
                this.gl.clearDepth(depth);
                clearTarget |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
            }
            if (clearTarget !== 0){
                this.gl.clear(clearTarget);
            }
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
        return new Viewport(0,0,this.getBufferWidth(),this.getBufferHeight());
    }

    protected __configureClearScissor():void{
        this.gl.disable(WebGLRenderingContext.SCISSOR_TEST);
    }

    constructor(public gl: WebGLRenderingContext){

    }
}
