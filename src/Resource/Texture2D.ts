import TextureSizeCalculator from "../Util/TextureSizeCalculator";
import ResourceBase from "./ResourceBase";
import Viewport from "./Viewport";
type ImageSource = HTMLVideoElement | HTMLCanvasElement | HTMLImageElement | ImageData;

export type ImageUploadConfig = {
  flipY?: boolean,
  premultipliedAlpha?: boolean,
};

type ResizeResult = {
  result: ImageSource,
  width: number,
  height: number,
};

export default class Texture2D extends ResourceBase {
  public static defaultTextures: Map<WebGLRenderingContext, Texture2D> = new Map<WebGLRenderingContext, Texture2D>();

  private static _resizerCanvas: HTMLCanvasElement = document.createElement("canvas");

  /**
   * ミップマップの更新が必要なフィルタ
   * @type {number[]}
   */
  private static _filtersNeedsMipmap: number[] = [
    WebGLRenderingContext.LINEAR_MIPMAP_LINEAR,
    WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,
    WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,
    WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,
  ];

  public static maxTextureSize: number;

  public static generateDefaultTexture (gl: WebGLRenderingContext): void {
    Texture2D.defaultTextures.set(gl, null); // for preventing called this method recursively by instanciating default texture
    const texture = new Texture2D(gl);
    texture.update(0, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    Texture2D.defaultTextures.set(gl, texture);
  }

  public readonly texture: WebGLTexture;

  public get magFilter (): number {
    return this._magFilter;
  }

  public set magFilter (filter: number) {
    if (this._magFilter !== filter) {
      this._texParameterChanged = true;
      this._magFilter = filter;
      this._ensureMipmap();
    }
  }

  public get minFilter (): number {
    return this._minFilter;
  }

  public set minFilter (filter: number) {
    if (this._minFilter !== filter) {
      this._texParameterChanged = true;
      this._minFilter = filter;
      this._ensureMipmap();
    }
  }

  public get wrapS (): number {
    return this._wrapS;
  }

  public set wrapS (filter: number) {
    if (this._wrapS !== filter) {
      this._texParameterChanged = true;
      this._wrapS = filter;
    }
  }

  public get wrapT (): number {
    return this._wrapT;
  }

  public set wrapT (filter: number) {
    if (this._wrapT !== filter) {
      this._texParameterChanged = true;
      this._wrapT = filter;
    }
  }

  /**
   * Width of this texture
   * @return {number} [description]
   */
  public get width (): number {
    return this._width;
  }

  /**
   * Height of this texture
   * @return {number} [description]
   */
  public get height (): number {
    return this._height;
  }

  public get viewport (): Viewport{
    return new Viewport(0, 0, this.width, this.height);
  }

  public get drawerContext (): CanvasRenderingContext2D {
    if (!this._drawerContext) {
      const c = document.createElement("canvas");
      c.width = this._width;
      c.height = this.height;
      this._drawerContext = c.getContext("2d");
      this._updateDrawingContextWithCurrent();
    }
    return this._drawerContext;
  }

  private _texParameterChanged = true;

  private _drawerContext: CanvasRenderingContext2D;

  private _magFilter: number = WebGLRenderingContext.LINEAR;

  private _minFilter: number = WebGLRenderingContext.LINEAR;

  private _wrapS: number = WebGLRenderingContext.REPEAT;

  private _wrapT: number = WebGLRenderingContext.REPEAT;

  private _format: number = WebGLRenderingContext.UNSIGNED_BYTE;

  private _width: number;

  private _height: number;

  private _type: number;

  constructor (gl: WebGLRenderingContext) {
    super(gl);
    if (!Texture2D.maxTextureSize) {
      Texture2D.maxTextureSize = gl.getParameter(WebGLRenderingContext.MAX_TEXTURE_SIZE);
    }
    this.texture = gl.createTexture();
  }

  public update (level: number, width: number, height: number, border: number, format: number, type: number, pxiels?: ArrayBufferView, config?: ImageUploadConfig): void;
  public update (image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, config?: ImageUploadConfig): void;
  public update (levelOrImage: any, widthOrConfig: any, height?: number, border?: number, format?: number, type?: number, pixels?: ArrayBufferView, config?: ImageUploadConfig): void {
    this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
    let uploadConfig: ImageUploadConfig;
    let image: HTMLImageElement;
    let width: number;
    let level: number;
    if (height === void 0) {
      uploadConfig = widthOrConfig || {
        flipY: false,
        premultipliedAlpha: false,
      };
      image = levelOrImage as HTMLImageElement;
    } else {
      level = levelOrImage as number;
      width = widthOrConfig as number;
      uploadConfig = config || {
        flipY: false,
        premultipliedAlpha: false,
      };
    }
    if (uploadConfig.flipY === void 0) {
      uploadConfig.flipY = false;
    }
    if (uploadConfig.premultipliedAlpha === void 0) {
      uploadConfig.premultipliedAlpha = false;
    }
    this.gl.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, uploadConfig.flipY ? 1 : 0);
    this.gl.pixelStorei(WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL, uploadConfig.premultipliedAlpha ? 1 : 0);
    if (height === void 0) { // something image was specified
      const resizedResource = this._justifyResource(image);
      this._width = resizedResource.width;
      this._height = resizedResource.height;
      this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, resizedResource.result);
      this._type = WebGLRenderingContext.UNSIGNED_BYTE;
      this._format = WebGLRenderingContext.RGBA;
    } else {
      if (pixels === void 0) {
        pixels = null;
      }
      if (width === 0 || height === 0) { // Edge browser cannot accept a texture with 0 size
        this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, level, WebGLRenderingContext.RGBA, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
        this._type = WebGLRenderingContext.UNSIGNED_BYTE;
        this._width = 1;
        this._height = 1;
        this._format = WebGLRenderingContext.RGBA;
      } else {
        this._width = width;
        this._height = height;
        this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, level, format, width, height, border, format, type, pixels);
        this._format = format;
        this._type = type;
      }
    }
    this._ensureMipmap();
    this.valid = true;
  }

  public getRawPixels (): Uint8Array {
    if (this._type === WebGLRenderingContext.UNSIGNED_BYTE && this._format === WebGLRenderingContext.RGBA) {
      const buffer = new Uint8Array(this.width * this.height * 4);
      const frame = this.gl.createFramebuffer();
      this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, frame);
      this.gl.framebufferTexture2D(WebGLRenderingContext.FRAMEBUFFER, WebGLRenderingContext.COLOR_ATTACHMENT0, WebGLRenderingContext.TEXTURE_2D, this.texture, 0);
      if (this.gl.checkFramebufferStatus(WebGLRenderingContext.FRAMEBUFFER) === WebGLRenderingContext.FRAMEBUFFER_COMPLETE) {
        this.gl.readPixels(0, 0, this.width, this.height, this._format, this._type, buffer);
      }
      this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
      return buffer;
    } else {
      throw new Error("Unsupported");
    }
  }

  public applyDraw (): void {
    if (this._drawerContext) {
      this.update(this._drawerContext.canvas);
    }
  }

  public register (registerNumber: number): void {
    this.gl.activeTexture(WebGLRenderingContext.TEXTURE0 + registerNumber);
    this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
    if (this._texParameterChanged) {
      this._updateTexParameter();
    }
  }

  public destroy (): void {
    super.destroy();
    this.gl.deleteTexture(this.texture);
  }

  private _justifyResource (image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): ResizeResult {
    if (image instanceof HTMLImageElement) {
      return this._justifyImage(image);
    } else if (image instanceof HTMLCanvasElement) {
      return this._justifyCanvas(image);
    } else if (image instanceof HTMLVideoElement) {
      return this._justifyVideo(image);
    } else {
      throw new Error("Unsupported resource type");
    }
  }

  // There should be more effective way to resize texture
  private _justifyImage (img: HTMLImageElement): ResizeResult {
    const w = img.naturalWidth, h = img.naturalHeight;
    const size = TextureSizeCalculator.getPow2Size(w, h);
    if (w !== size.width || h !== size.height) {
      const canv = Texture2D._resizerCanvas;
      canv.height = size.height;
      canv.width = size.width;
      canv.getContext("2d").drawImage(img, 0, 0, w, h, 0, 0, size.width, size.height);
      return {
        result: canv,
        height: canv.height,
        width: canv.width,
      };
    }
    return {
      result: img,
      width: w,
      height: h,
    };
  }

  private _justifyCanvas (canvas: HTMLCanvasElement): ResizeResult {
    const w = canvas.width;
    const h = canvas.height;
    const size = TextureSizeCalculator.getPow2Size(w, h);
    if (w !== size.width || h !== size.height) {
      canvas.width = size.width;
      canvas.height = size.height;
      return {
        result: canvas,
        width: canvas.width,
        height: canvas.height,
      };
    }
    return {
      result: canvas,
      width: canvas.width,
      height: canvas.height,
    };
  }

  private _justifyVideo (video: HTMLVideoElement): ResizeResult {
    const w = video.videoWidth, h = video.videoHeight;
    const size = TextureSizeCalculator.getPow2Size(w, h); // largest 2^n integer that does not exceed s
    if (w !== size.width || h !== size.height) {
      const canv = Texture2D._resizerCanvas;
      canv.height = size.height;
      canv.width = size.width;
      canv.getContext("2d").drawImage(video, 0, 0, w, h, 0, 0, size.width, size.height);
      return {
        result: canv,
        width: w,
        height: h,
      };
    }
    return {
      result: video,
      width: w,
      height: h,
    };
  }

  private _updateTexParameter (): void {
    this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, this._minFilter);
    this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, this._magFilter);
    this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, this._wrapS);
    this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, this._wrapT);
    this._texParameterChanged = false;
  }

  private _ensureMipmap (): void {
    if (Texture2D._filtersNeedsMipmap.indexOf(this.magFilter) >= 0 || Texture2D._filtersNeedsMipmap.indexOf(this.minFilter) >= 0) {
      this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
      this.gl.generateMipmap(WebGLRenderingContext.TEXTURE_2D);
    }
  }

  private _updateDrawingContextWithCurrent (): void {
    const imageData = this.drawerContext.createImageData(this.width, this.height);
    const buffer = this.getRawPixels();
    for (let i = 0; i < buffer.length; i++) {
      imageData.data[i] = buffer[i];
    }
    this.drawerContext.putImageData(imageData, 0, 0);
  }
}
