import ResourceBase from "./ResourceBase";
type ImageSource = HTMLCanvasElement | HTMLImageElement | ImageData | ArrayBufferView;
export default class Texture2D extends ResourceBase {
  public readonly texture: WebGLTexture;

  constructor(gl: WebGLRenderingContext) {
    super(gl);
    this.texture = gl.createTexture();
  }

  public update(level: number, width: number, height: number, border: number, format: number, type: number, pxiels: ArrayBufferView, flipY?: boolean): void;
  public update(image: HTMLImageElement, flipY?: boolean): void;
  public update(levelOrImage: any, widthOrFlipY: any, height?: number, border?: number, format?: number, type?: number, pixels?: ArrayBufferView, flipYForBuffer?: boolean): void {
    this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
    let flipY = false;
    let image: HTMLImageElement;
    let width: number;
    let level: number;
    if (typeof height === "undefined") {
      flipY = widthOrFlipY ? true : false;
      image = levelOrImage as HTMLImageElement;
    } else {
      level = levelOrImage as number;
      width = widthOrFlipY as number;
    }
    this.gl.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, flipY ? 1 : 0);
    if (typeof height === "undefined") {
      this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, this._checkSize(image));
    } else {
      this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, level, format, width, height, border, format, type, pixels);
    }
    this.valid = true;
  }

  public register(registerNumber: number): void {
    this.gl.activeTexture(WebGLRenderingContext.TEXTURE0 + registerNumber);
    this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
    this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, WebGLRenderingContext.NEAREST);
    this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, WebGLRenderingContext.NEAREST);
  }

  public destroy(): void {
    super.destroy();
    this.gl.deleteTexture(this.texture);
  }

  // There should be more effective way to resize texture
  private _checkSize(img: HTMLImageElement): HTMLCanvasElement | HTMLImageElement {
    const w = img.naturalWidth, h = img.naturalHeight;
    const size = Math.pow(2, Math.log(Math.min(w, h)) / Math.LN2 | 0); // largest 2^n integer that does not exceed s
    if (w !== h || w !== size) {
      const canv = document.createElement("canvas");
      canv.height = canv.width = size;
      canv.getContext("2d").drawImage(img, 0, 0, w, h, 0, 0, size, size);
      return canv;
    }
    return img;
  }
}
