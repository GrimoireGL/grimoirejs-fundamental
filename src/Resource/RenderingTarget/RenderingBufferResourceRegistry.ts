import GLRelatedRegistryBase from "../GLRelatedRegistryBase";
import Renderbuffer from "../RenderBuffer";
import Texture2D from "../Texture2D";
/**
 * =
 */
export default class RenderingBufferResourceRegistry extends GLRelatedRegistryBase {

    public static registryName = "RenderingBufferResourceRegistry";
    /**
     * Obtain reference of the class by WebGLRenderingContext.
     * @param gl
     */
    public static get (gl: WebGLRenderingContext): RenderingBufferResourceRegistry {
        return this.__get(gl, RenderingBufferResourceRegistry);
    }

    public backbuffers: { [key: string]: Texture2D } = {};

    public depthBuffers: { [key: string]: Renderbuffer } = {};

    constructor (public gl: WebGLRenderingContext) {
        super();
    }

    public setBackbuffer (name: string, backbuffer: Texture2D): void {
        this.backbuffers[name] = backbuffer;
    }

    public getBackbuffer (name: string): Texture2D {
        return this.backbuffers[name];
    }

    public setDepthBuffer (name: string, depthBuffer: Renderbuffer): void {
        this.depthBuffers[name] = depthBuffer;
    }

    public getDepthBuffer (name: string): Renderbuffer {
        return this.depthBuffers[name];
    }
}
