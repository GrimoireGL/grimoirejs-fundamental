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
      this.updateDrawerCanvas();
    }
    return this._drawerContext;
  }

  private _drawerContext: CanvasRenderingContext2D;

  private _width: number;

  private _height: number;

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
      uploadConfig = {
        flipY: true,
        premultipliedAlpha: false,
        ...config,
      };
    }
    // tslint:disable:no-parameter-reassignment
    this.gl.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, uploadConfig.flipY ? 1 : 0);
    this.gl.pixelStorei(WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL, uploadConfig.premultipliedAlpha ? 1 : 0);
    if (height === void 0) { // something image was specified
      const resizedResource = this.__ensurePOT(image);
      this._width = resizedResource.width;
      this._height = resizedResource.height;
      this.gl.texImage2D(this.textureType, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, resizedResource.result);
      this.__type = WebGLRenderingContext.UNSIGNED_BYTE;
      this.__format = WebGLRenderingContext.RGBA;
    } else {
      if (pixels === void 0) {
        pixels = null;
      }
      if (width === 0 || height === 0) { // Edge browser cannot accept a texture with 0 size
        width = 1;
        height = 1;
        format = WebGLRenderingContext.RGB;
        type = WebGLRenderingContext.UNSIGNED_BYTE;
        pixels = new Uint8Array([0, 0, 0]);
      }
      this._width = width;
      this._height = height;
      this.gl.texImage2D(this.textureType, level, format, width, height, border, format, type, pixels);
      this.__format = format;
      this.__type = type;
    }
    this.__ensureMipmap();
    this.valid = true;
  }

  public updateDrawerCanvas(): void {
    const imageData = this.drawerContext.createImageData(this.width, this.height);
    const buffer = this.getRawPixels();
    const bufferSize = this.width * this.height * GLUtility.formatToElementCount(this.format);
    for (let i = 0; i < bufferSize; i++) {
      imageData.data[i] = buffer[i];
    }
    this.drawerContext.putImageData(imageData, 0, 0);
    this.drawerContext.setTransform(1, 0, 0, -1, 0, this.height);
    this.drawerContext.drawImage(this.drawerContext.canvas, 0, 0);
  }

  public getRawPixels<T extends ArrayBufferView = ArrayBufferView>(x = 0, y = 0, width = this.width, height = this.height): T {
    return this.__getRawPixels<T>(this.type, this.format, x, y, width, height, WebGLRenderingContext.TEXTURE_2D);
  }

  public applyDraw(): void {
    if (this._drawerContext) {
      this.update(this._drawerContext.canvas);
    }
  }

  protected __ensureMipmap(): void {
    if (this.__needMipmap(this.minFilter)) {
      this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.resourceReference);
      this.gl.generateMipmap(WebGLRenderingContext.TEXTURE_2D);
    }
  }
}
