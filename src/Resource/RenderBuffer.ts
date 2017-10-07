import ResourceBase from "./ResourceBase";

export default class RenderBuffer extends ResourceBase {
  public readonly renderBuffer: WebGLRenderbuffer;
  constructor (gl: WebGLRenderingContext) {
    super(gl);
    this.renderBuffer = gl.createRenderbuffer();
  }

  public update (format: number, width: number, height: number): void {
    this.gl.bindRenderbuffer(WebGLRenderingContext.RENDERBUFFER, this.renderBuffer);
    this.gl.renderbufferStorage(WebGLRenderingContext.RENDERBUFFER, format, width, height);
    this.valid = true;
  }

  public bind (): void {
    this.gl.bindRenderbuffer(WebGLRenderingContext.RENDERBUFFER, this.renderBuffer);
  }

  public destroy (): void {
    this.gl.deleteRenderbuffer(this.renderBuffer);
    super.destroy();
  }

}
