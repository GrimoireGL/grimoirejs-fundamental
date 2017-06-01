import ResourceBase from "./ResourceBase";
import TextureSizeCalculator from "../Util/TextureSizeCalculator";
type ImageSource = HTMLCanvasElement | HTMLImageElement | ImageData | ArrayBufferView;

export type ImageUploadConfig = {
    flipY?: boolean,
    premultipliedAlpha?: boolean
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
        WebGLRenderingContext.NEAREST_MIPMAP_NEAREST
    ];

    public static maxTextureSize: number;

    public static generateDefaultTexture(gl: WebGLRenderingContext): void {
        Texture2D.defaultTextures.set(gl, null); // for preventing called this method recursively by instanciating default texture
        const texture = new Texture2D(gl);
        texture.update(0, 1, 1, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 0]));
        Texture2D.defaultTextures.set(gl, texture);
    }

    public readonly texture: WebGLTexture;

    public get magFilter(): number {
        return this._magFilter;
    }

    public set magFilter(filter: number) {
        if (this._magFilter !== filter) {
            this._texParameterChanged = true;
            this._magFilter = filter;
            this._ensureMipmap();
        }
    }

    public get minFilter(): number {
        return this._minFilter;
    }

    public set minFilter(filter: number) {
        if (this._minFilter !== filter) {
            this._texParameterChanged = true;
            this._minFilter = filter;
            this._ensureMipmap();
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

    private _texParameterChanged: boolean = true;

    private _magFilter: number = WebGLRenderingContext.LINEAR;

    private _minFilter: number = WebGLRenderingContext.LINEAR;

    private _wrapS: number = WebGLRenderingContext.REPEAT;

    private _wrapT: number = WebGLRenderingContext.REPEAT;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
        if (!Texture2D.maxTextureSize) {
            Texture2D.maxTextureSize = gl.getParameter(WebGLRenderingContext.MAX_TEXTURE_SIZE);
        }
        this.texture = gl.createTexture();
    }

    public update(level: number, width: number, height: number, border: number, format: number, type: number, pxiels?: ArrayBufferView, config?: ImageUploadConfig): void;
    public update(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement, config?: ImageUploadConfig): void;
    public update(levelOrImage: any, widthOrConfig: any, height?: number, border?: number, format?: number, type?: number, pixels?: ArrayBufferView, config?: ImageUploadConfig): void {
        this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
        let uploadConfig: ImageUploadConfig;
        let image: HTMLImageElement;
        let width: number;
        let level: number;
        if (height === void 0) {
            uploadConfig = widthOrConfig || {
                flipY: false,
                premultipliedAlpha: false
            };
            image = levelOrImage as HTMLImageElement;
        } else {
            level = levelOrImage as number;
            width = widthOrConfig as number;
            uploadConfig = config || {
                flipY: false,
                premultipliedAlpha: false
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
            if (image instanceof HTMLImageElement) {
                this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, this._justifyImage(image));
            } else if (image instanceof HTMLCanvasElement) {
                this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, this._justifyCanvas(image));
            } else if (image instanceof HTMLVideoElement) {
                this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, 0, WebGLRenderingContext.RGBA, WebGLRenderingContext.RGBA, WebGLRenderingContext.UNSIGNED_BYTE, this._justifyVideo(image));
            }
        } else {
            if (pixels === void 0) {
                pixels = null;
            }
            this.gl.texImage2D(WebGLRenderingContext.TEXTURE_2D, level, format, width, height, border, format, type, pixels);
        }
        this._ensureMipmap();
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
    private _justifyImage(img: HTMLImageElement): HTMLCanvasElement | HTMLImageElement {
        const w = img.naturalWidth, h = img.naturalHeight;
        const size = TextureSizeCalculator.getPow2Size(w, h);
        if (w !== size.width || h !== size.height) {
            const canv = Texture2D._resizerCanvas;
            canv.height = size.height;
            canv.width = size.width;
            canv.getContext("2d").drawImage(img, 0, 0, w, h, 0, 0, size.width, size.height);
            return canv;
        }
        return img;
    }

    private _justifyCanvas(canvas: HTMLCanvasElement): HTMLCanvasElement {
        const w = canvas.width;
        const h = canvas.height;
        const size = TextureSizeCalculator.getPow2Size(w, h);
        if (w !== size.width || h !== size.height) {
            canvas.width = size.width;
            canvas.height = size.height;
        }
        return canvas;
    }

    private _justifyVideo(video: HTMLVideoElement): HTMLVideoElement | HTMLCanvasElement {
        const w = video.videoWidth, h = video.videoHeight;
        const size = TextureSizeCalculator.getPow2Size(w, h); // largest 2^n integer that does not exceed s
        if (w !== size.width || h !== size.height) {
            const canv = Texture2D._resizerCanvas;
            canv.height = size.height;
            canv.width = size.width;
            canv.getContext("2d").drawImage(video, 0, 0, w, h, 0, 0, size.width, size.height);
            return canv;
        }
        return video;
    }

    private _updateTexParameter(): void {
        this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MIN_FILTER, this._minFilter);
        this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_MAG_FILTER, this._magFilter);
        this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_S, this._wrapS);
        this.gl.texParameteri(WebGLRenderingContext.TEXTURE_2D, WebGLRenderingContext.TEXTURE_WRAP_T, this._wrapT);
        this._texParameterChanged = false;
    }

    private _ensureMipmap(): void {
        if (Texture2D._filtersNeedsMipmap.indexOf(this.magFilter) >= 0 || Texture2D._filtersNeedsMipmap.indexOf(this.minFilter) >= 0) {
            this.gl.bindTexture(WebGLRenderingContext.TEXTURE_2D, this.texture);
            this.gl.generateMipmap(WebGLRenderingContext.TEXTURE_2D);
        }
    }
}
