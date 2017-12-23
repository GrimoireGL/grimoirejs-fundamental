import FrameBuffer from "../FrameBuffer";
import RenderBuffer from "../RenderBuffer";
import Texture2D from "../Texture2D";
import TextureCube from "../TextureCube";
import Viewport from "../Viewport";
import ICubemapRenderingTarget from "./ICubemapRenderingTarget";
import GLStateConfigurator from "../../Material/GLStateConfigurator";
/**
 * Render target contains cubemap and render buffer
 */
export default class OffscreenCubemapRenderTarget implements ICubemapRenderingTarget {
    public readonly fbos: { [key: string]: FrameBuffer } = {};

    constructor(public gl: WebGLRenderingContext, public texture: TextureCube, public depthBuffer?: RenderBuffer) {
        for (const direction in TextureCube.imageDirections) {
            this.fbos[direction] = new FrameBuffer(gl);
            this.fbos[direction].update(texture, TextureCube.imageDirections[direction], 0);
            if (depthBuffer) {
                this.fbos[direction].update(depthBuffer);
            }
        }
    }

    public beforeDraw(clearFlag: number, color: number[], depth: number, direction?: string): void {
        if (!direction) {
            throw new Error("Parameter direction have not specified");
        }
        this.bind(direction);
        const gc = GLStateConfigurator.get(this.gl);
        if (clearFlag !== 0) {
            let clearTarget = 0;
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

    public bind(direction: string): void {
        this.fbos[direction].bind();
    }

}
