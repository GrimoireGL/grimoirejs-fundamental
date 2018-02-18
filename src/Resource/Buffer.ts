import GLResource from "./GLResource";
import { Nullable } from "grimoirejs/ref/Tool/Types";
import GLConstantUtility from "../Util/GLConstantUtility";

export default class Buffer extends GLResource<WebGLBuffer> {
  /**
   * If this flag was true, buffer instance will keep Float32Array on class field.
   */
  public keepSource = false;

  public elementType?: number;

  public length?: number;

  public get bufferSource(): Nullable<BufferSource> {
    if (this.keepSource) {
      return this._bufferSource;
    } else {
      throw new Error("Accessing bufferSource getter of Buffer class instance require keepSource flag being enabled before updating Buffer.");
    }
  }

  private _bufferSource: Nullable<BufferSource> = null;


  constructor(gl: WebGLRenderingContext, public readonly target: number = WebGLRenderingContext.ARRAY_BUFFER, public usage: number = WebGLRenderingContext.STATIC_DRAW) {
    super(gl, gl.createBuffer()!);
  }

  public update(length: number): void;
  public update(buffer: BufferSource): void;
  public update(bufferOrLength: number | BufferSource): void {
    this.elementType = undefined;
    this.length = undefined;
    this.bind();
    this._bufferSource = null;
    if (typeof bufferOrLength === "number") {
      this.gl.bufferData(this.target, bufferOrLength, this.usage);
      this.length = bufferOrLength;
    } else {
      this.gl.bufferData(this.target, bufferOrLength, this.usage);
      this._bufferSource = bufferOrLength;
      if (GLConstantUtility.isTypedArrayBuffer(bufferOrLength)) {
        this.elementType = GLConstantUtility.getElementTypeFromTypedArray(bufferOrLength);
        this.length = bufferOrLength.length;
      }
    }
    this.valid = true;
  }

  public updateFromArray(array: number[], isFloat?: true): void;
  public updateFromArray(array: number[], isFloat: false, signed?: boolean, max?: number): void;
  public updateFromArray(array: number[], isFloat: boolean = true, signed: boolean = false, max?: number): void {
    let typedArray: ArrayBufferView;
    if (isFloat) {
      typedArray = new Float32Array(array);
    } else {
      if (!max) {
        max = Math.max(...array);
      }
      let arrayType = GLConstantUtility.getSuitableIntegerElementTypeFromMaximum(max, signed);
      let arrayCtor = GLConstantUtility.getTypedArrayConstructorFromElementType(arrayType);
      typedArray = new arrayCtor(array);
    }
    this.update(typedArray);
  }

  public bind(): void {
    this.gl.bindBuffer(this.target, this.resourceReference);
  }

  public destroy(): void {
    super.destroy();
    this._bufferSource = null;
    this.gl.deleteBuffer(this.resourceReference);
  }
}
