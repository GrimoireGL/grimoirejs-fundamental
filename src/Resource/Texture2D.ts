import ResourceBase from "./ResourceBase";
type ImageSource = HTMLCanvasElement | HTMLImageElement | ImageData | ArrayBufferView;
export default class Texture2D extends ResourceBase {
  public readonly texture: WebGLTexture;

  public get magFilter(): number {
    return this._magFilter;
  }

  public set magFilter(filter: number) {
    if (this._magFilter !== filter) {
      this._texParameterChanged = true;
      this._magFilter = filter;
    }
  }

  public get minFilter(): number {
    return this._minFilter;
  }

  public set minFilter(filter: number) {
    if (this._minFilter !== filter) {
      this._texParameterChanged = true;
      this._minFilter = filter;
    }
  }

  public get wrapS(): number {
    return this._wrapS;
  }

  public set wrapS(filter: number) {
    if (this._wrapS !== filter) {
      this._texParameterChanged = true;
      this._wrapS = filter;
    }
  }

  public get wrapT(): number {
    return this._wrapT;
  }

  public set wrapT(filter: number) {
    if (this._wrapT !== filter) {
      this._texParameterChanged = true;
      this._wrapT = filter;
    }
  }

  private _texParameterChanged = true;

  private _magFilter: number = WebGLRenderingContext.LINEAR;

  private _minFilter: number = WebGLRenderingContext.LINEAR;

  private _wrapS: number = WebGLRenderingContext.REPEAT;

  private _wrapT: number = WebGLRenderingContext.REPEAT;

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
    if (this._texParameterChanged) {
      this._updateTexParameter();
    }
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

  private _updateTexParameter(): void {
    this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, this._minFilter);
    this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, this._magFilter);
    this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, this._wrapS);
    this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, this._wrapT);
    this._texParameterChanged = false;
  }
}
