import GLResource from "./GLResource";
import RenderBuffer from "./RenderBuffer";
import Texture2D from "./Texture2D";

export default class FrameBuffer extends GLResource<WebGLFramebuffer> {
  constructor(gl: WebGLRenderingContext) {
    super(gl, gl.createFramebuffer());
  }

  public update(boundTo: RenderBuffer, attachTo?: number): void;
  public update(boundTo: Texture2D, level?: number, bindIndex?: number): void;
  public update(boundTo: Texture2D | RenderBuffer, level?: number, bindIndex?: number): void {
    this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, this.resourceReference);
    if (boundTo instanceof Texture2D) {
      if (typeof bindIndex === "undefined") {
        bindIndex = 0;
      }
      if (typeof level === "undefined") {
        level = 0;
      }
      this.gl.framebufferTexture2D(WebGLRenderingContext.FRAMEBUFFER, WebGLRenderingContext.COLOR_ATTACHMENT0 + bindIndex, WebGLRenderingContext.TEXTURE_2D, boundTo.resourceReference, level);
      if (this.gl.checkFramebufferStatus(WebGLRenderingContext.FRAMEBUFFER) !== WebGLRenderingContext.FRAMEBUFFER_COMPLETE) {
        throw new Error("INCOMPLETE framebuffer");
      }
    } else if (boundTo instanceof RenderBuffer) {
      const registerTarget: number = typeof level === "undefined" ? WebGLRenderingContext.DEPTH_ATTACHMENT : level;
      this.gl.framebufferRenderbuffer(WebGLRenderingContext.FRAMEBUFFER, registerTarget, WebGLRenderingContext.RENDERBUFFER, boundTo.resourceReference);
    }
    this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
  }

  public bind(): void {
    this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, this.resourceReference);
  }

  public destroy(): void {
    super.destroy();
    this.gl.deleteFramebuffer(this.resourceReference);
  }
}
