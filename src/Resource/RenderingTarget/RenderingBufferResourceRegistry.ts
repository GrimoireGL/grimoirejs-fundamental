import GLRelatedRegistryBase from "../GLRelatedRegistryBase";
import Renderbuffer from "../RenderBuffer";
import Texture2D from "../Texture2D";
/**
 * no document
 */
export default class RenderingBufferResourceRegistry extends GLRelatedRegistryBase {

  /**
   * no document
   */
  public static registryName = "RenderingBufferResourceRegistry";
  /**
   * Obtain reference of the class by WebGLRenderingContext.
   * @param gl
   */
  public static get(gl: WebGLRenderingContext): RenderingBufferResourceRegistry {
    return this.__get(gl, RenderingBufferResourceRegistry);
  }

  /**
   * no document
   */
  public backbuffers: { [key: string]: Texture2D } = {};

  /**
   * no document
   */
  public depthBuffers: { [key: string]: Renderbuffer } = {};

  constructor(public gl: WebGLRenderingContext) {
    super();
  }

  /**
   * no document
   * @param name
   * @param backbuffer
   */
  public setBackbuffer(name: string, backbuffer: Texture2D): void {
    this.backbuffers[name] = backbuffer;
  }

  /**
   * no document
   * @param name
   */
  public getBackbuffer(name: string): Texture2D {
    return this.backbuffers[name];
  }
  /**
   * no document
   * @param name
   * @param depthBuffer
   */
  public setDepthBuffer(name: string, depthBuffer: Renderbuffer): void {
    this.depthBuffers[name] = depthBuffer;
  }

  /**
   * no document
   * @param name
   */
  public getDepthBuffer(name: string): Renderbuffer {
    return this.depthBuffers[name];
  }
}
