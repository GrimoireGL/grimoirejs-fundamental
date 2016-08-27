import ResourceBase from "./ResourceBase";
type ImageSource = HTMLCanvasElement | HTMLImageElement | ImageData | ArrayBufferView;
export default class Texture2D extends ResourceBase {
  public readonly texture: WebGLTexture;

  public valid: boolean = false;
  constructor(gl: WebGLRenderingContext) {
    super(gl);
    this.texture = gl.createTexture();
  }

  public update(level: number, width: number, height: number, border: number, format: number, type: number, pxiels: ArrayBufferView, flipY?: boolean): void;
  public update(image: HTMLCanvasElement | HTMLImageElement | ImageData | ArrayBufferView, flipY?: boolean): void;
  public update(levelOrImage: any, widthOrFlipY: any, height?: number, border?: number, format?: number, type?: number, pixels?: ArrayBufferView, flipYForBuffer?: boolean): void {
    this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
    let flipY = false;
    let image: ImageData;
    let width: number;
    let level: number;
    if (typeof height === "undefined") {
      flipY = widthOrFlipY ? true : false;
      image = levelOrImage as ImageData;
    } else {
      level = levelOrImage as number;
      width = widthOrFlipY as number;
    }
    this.gl.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0);
    if (typeof height === "undefined") {
      this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, image);
    } else {
      this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, level, format, width, height, border, format, type, pixels);
    }
  }

  public destroy(): void {
    super.destroy();
    this.gl.deleteTexture(this.texture);
  }
}
