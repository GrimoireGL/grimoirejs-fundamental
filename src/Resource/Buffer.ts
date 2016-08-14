import ResourceBase from "./ResourceBase";
export default class Buffer extends ResourceBase {
  public readonly buffer: WebGLBuffer;

  public containsData: boolean = false;

  constructor(gl: WebGLRenderingContext, public readonly target: number, public usage: number) {
    super(gl);
    this.buffer = gl.createBuffer();
  }

  public update(length: number): void;
  public update(buffer: BufferSource): void;
  public update(offset: number, buffer: BufferSource): void;
  public update(length: number | BufferSource, subBuffer?: BufferSource): void {
    this.containsData = true;
    this.bind();
    if (subBuffer) {
      if (!this.containsData) {
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
  }

  public bind(): void {
    this.gl.bindBuffer(this.target, this.buffer);
  }

  public destroy(): void {
    super.destroy();
    this.gl.deleteBuffer(this.buffer);
  }
}
