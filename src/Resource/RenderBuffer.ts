import GLResource from "./GLResource";

export default class RenderBuffer extends GLResource<WebGLRenderbuffer> {
  constructor(gl: WebGLRenderingContext) {
    super(gl, gl.createRenderbuffer());
  }

  public update(format: number, width: number, height: number): void {
    this.gl.bindRenderbuffer(WebGLRenderingContext.RENDERBUFFER, this.resourceReference);
    this.gl.renderbufferStorage(WebGLRenderingContext.RENDERBUFFER, format, width, height);
    this.valid = true;
  }

  public bind(): void {
    this.gl.bindRenderbuffer(WebGLRenderingContext.RENDERBUFFER, this.resourceReference);
  }

  public destroy(): void {
    this.gl.deleteRenderbuffer(this.resourceReference);
    super.destroy();
  }

}
