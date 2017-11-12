import TextureSizeCalculator from "../Util/TextureSizeCalculator";
import GLResource from "./GLResource";
import GLUtility from "./GLUtility";
import Texture from "./Texture";
import Viewport from "./Viewport";
export type ImageUploadConfig = {
  flipY?: boolean,
  premultipliedAlpha?: boolean,
};

export default class Texture2D extends Texture {
  public static defaultTextures: Map<WebGLRenderingContext, Texture2D> = new Map<WebGLRenderingContext, Texture2D>();
  public static maxTextureSize: number;

  public static generateDefaultTexture(gl: WebGLRenderingContext): void {
    Texture2D.defaultTextures.set(gl, null); // for preventing called this method recursively by instanciating default texture
    const texture = new Texture2D(gl);
    texture.update(0, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
    Texture2D.defaultTextures.set(gl, texture);
  }

  /**
   * Width of this texture
   * @return {number} [description]
   */
  public get width(): number {
    return this._width;
  }

  /**
   * Height of this texture
   * @return {number} [description]
   */
  public get height(): number {
    return this._height;
  }

  public get viewport(): Viewport {
    return new Viewport(0, 0, this.width, this.height);
  }

  public get drawerContext(): CanvasRenderingContext2D {
    if (!this._drawerContext) {
      const c = document.createElement("canvas");
      c.width = this._width;
      c.height = this.height;
      this._drawerContext = c.getContext("2d");
      this._updateDrawingContextWithCurrent();
    }
    return this._drawerContext;
  }

  private _drawerContext: CanvasRenderingContext2D;

  private _format: number = WebGLRenderingContext.UNSIGNED_BYTE;

  private _width: number;

  private _height: number;

  private _type: number;

  constructor(gl: WebGLRenderingContext) {
    super(gl, WebGLRenderingContext.TEXTURE_2D);
    if (!Texture2D.maxTextureSize) {
      Texture2D.maxTextureSize = gl.getParameter(WebGLRenderingContext.MAX_TEXTURE_SIZE);
    }
  }

  public update(level: number, width: number, height: number, border: number, format: number, type: number, pxiels?: ArrayBufferView, config?: ImageUploadConfig): void;
  public update(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, config?: ImageUploadConfig): void;
  public update(levelOrImage: any, widthOrConfig: any, height?: number, border?: number, format?: number, type?: number, pixels?: ArrayBufferView, config?: ImageUploadConfig): void {
    this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.resourceReference);
    let uploadConfig: ImageUploadConfig;
    let image: HTMLImageElement;
    let width: number;
    let level: number;
    if (height === void 0) {
      uploadConfig = {
        flipY: true,
        premultipliedAlpha: false,
        ...widthOrConfig,
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
      const resizedResource = this.__justifyResource(image);
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
    this.__ensureMipmap();
    this.valid = true;
  }

  public getRawPixels<T extends ArrayBufferView = ArrayBufferView>(x = 0, y = 0, width = this.width, height = this.height): T {
    return this.__getRawPixels<T>(this._type, this._format, x, y, width, height);
  }

  public applyDraw(): void {
    if (this._drawerContext) {
      this.update(this._drawerContext.canvas, { flipY: false });
    }
  }

  private _updateDrawingContextWithCurrent(): void {
    const imageData = this.drawerContext.createImageData(this.width, this.height);
    const buffer = this.getRawPixels();
    const bufferSize = this.width * this.height * GLUtility.formatToElementCount(this._format);
    for (let i = 0; i < bufferSize; i++) {
      imageData.data[i] = buffer[i];
    }
    this.drawerContext.putImageData(imageData, 0, 0);
  }
}
