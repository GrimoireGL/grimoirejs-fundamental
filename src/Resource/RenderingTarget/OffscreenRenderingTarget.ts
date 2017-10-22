import FrameBuffer from "../FrameBuffer";
import RenderBuffer from "../RenderBuffer";
import Texture2D from "../Texture2D";
import Viewport from "../Viewport";
import IRenderingTarget from "./IRenderingTarget";
/**
 * Render target contains texture and render buffer
 */
export default class OffscreenRenderTarget implements IRenderingTarget {
  public readonly fbo: FrameBuffer;

  constructor(public gl: WebGLRenderingContext, public textures: Texture2D[], public depthBuffer?: RenderBuffer) {
    if (textures.length === 0) {
      throw new Error("Textures must contain 1 texture at least");
    }
    this.fbo = new FrameBuffer(gl);
    for (let i = 0; i < textures.length; i++) {
      this.fbo.update(this.textures[i], 0, i);
    }
    this.fbo.update(depthBuffer);
  }

  public beforeDraw(clearFlag: number, color: number[], depth: number): void {
    this.bind();
    if (clearFlag !== 0) {
      let clearTarget = 0;
      if ((clearFlag & WebGLRenderingContext.COLOR_BUFFER_BIT) !== 0 && color) {
        this.gl.clearColor.apply(this.gl, color);
        clearTarget |= WebGLRenderingContext.COLOR_BUFFER_BIT;
      }
      if ((clearFlag & WebGLRenderingContext.DEPTH_BUFFER_BIT) !== 0 && depth !== null && this.depthBuffer) {
        this.gl.clearDepth(depth);
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
  public get texture(): Texture2D {
    return this.textures[0];
  }
}
