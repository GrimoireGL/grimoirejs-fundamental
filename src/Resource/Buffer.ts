import ResourceBase from "./ResourceBase";
export default class Buffer extends ResourceBase {
  public readonly buffer: WebGLBuffer;

  constructor(gl: WebGLRenderingContext, public readonly target: number = WebGLRenderingContext.ARRAY_BUFFER, public usage: number = WebGLRenderingContext.ELEMENT_ARRAY_BUFFER) {
    super(gl);
    this.buffer = gl.createBuffer();
  }

  public update(length: number): void;
  public update(buffer: BufferSource): void;
  public update(offset: number, buffer: BufferSource): void;
  public update(length: number | BufferSource, subBuffer?: BufferSource): void {
    this.bind();
    if (subBuffer) {
      if (!this.valid) {
        this.gl.bufferData(this.target, length as number + subBuffer.byteLength, this.usage);
      }
      this.gl.bufferSubData(this.target, length as number, subBuffer);
    } else {
      if (typeof length === "number") {
        this.gl.bufferData(this.target, length as number, this.usage);
      } else {
        this.gl.bufferData(this.target, length as BufferSource, this.usage);
      }
    }
    this.valid = true;
  }

  public bind(): void {
    this.gl.bindBuffer(this.target, this.buffer);
  }

  public destroy(): void {
    super.destroy();
    this.gl.deleteBuffer(this.buffer);
  }
}
