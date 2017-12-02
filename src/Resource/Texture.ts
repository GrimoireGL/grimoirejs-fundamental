import TextureSizeCalculator from "../Util/TextureSizeCalculator";
import GLResource from "./GLResource";
import GLUtility from "./GLUtility";
import IResizeResult from "./IResizeResult";
export default abstract class Texture extends GLResource<WebGLTexture> {

    private static _resizerCanvas: HTMLCanvasElement = document.createElement("canvas");

    private static _resizerContext = Texture._resizerCanvas.getContext("2d");

    /**
     * Filters requires updating of mipmap
     * @type {number[]}
     */
    private static _filtersNeedsMipmap: number[] = [
        WebGLRenderingContext.LINEAR_MIPMAP_LINEAR,
        WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,
        WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,
        WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,
    ];

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
            this.__ensureMipmap();
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

    public get format(): number {
        return this.__format;
    }

    public get type(): number {
        return this.__type;
    }

    protected __format: number = WebGLRenderingContext.RGBA;

    protected __type: number = WebGLRenderingContext.UNSIGNED_BYTE;

    private _texParameterChanged = true;

    private _magFilter: number = WebGLRenderingContext.LINEAR;

    private _minFilter: number = WebGLRenderingContext.LINEAR;

    private _wrapS: number = WebGLRenderingContext.REPEAT;

    private _wrapT: number = WebGLRenderingContext.REPEAT;

    constructor(gl: WebGLRenderingContext, public textureType: number) {
        super(gl, gl.createTexture());
    }

    public destroy(): void {
        super.destroy();
        this.gl.deleteTexture(this.resourceReference);
    }

    public register(registerNumber: number): void {
        this.gl.activeTexture(WebGLRenderingContext.TEXTURE0 + registerNumber);
        this.gl.bindTexture(this.textureType, this.resourceReference);
        this.__applyTexParameter();
    }

    protected __getRawPixels<T extends ArrayBufferView = ArrayBufferView>(type: number, format: number, x = 0, y = 0, width: number, height: number, from: number): T {
        const bufferCtor = GLUtility.typeToTypedArrayConstructor(type);
        const buffer = new bufferCtor(width * height * GLUtility.formatToElementCount(format));
        const frame = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, frame);
        this.gl.framebufferTexture2D(WebGLRenderingContext.FRAMEBUFFER, WebGLRenderingContext.COLOR_ATTACHMENT0, from, this.resourceReference, 0);
        if (this.gl.checkFramebufferStatus(WebGLRenderingContext.FRAMEBUFFER) === WebGLRenderingContext.FRAMEBUFFER_COMPLETE) {
            this.gl.readPixels(x, y, width, height, format, type, buffer);
        }
        this.gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
        return buffer as T;
    }

    /**
     * Ensure specified resource is POT(Power of Two) resource.
     * If speciefied resource was NPOT, resize specified resource to POT.
     * @param image
     */
    protected __ensurePOT(image: HTMLImageElement | HTMLCanvasElement | HTMLVideoElement): IResizeResult {
        if (image instanceof HTMLImageElement) {
            return this._ensureImagePOT(image);
        } else if (image instanceof HTMLCanvasElement) {
            return this._ensureCanvasPOT(image);
        } else if (image instanceof HTMLVideoElement) {
            return this._ensureVideoPOT(image);
        } else {
            throw new Error("Unsupported resource type");
        }
    }

    protected abstract __ensureMipmap(): void;

    /**
     * Check specified min filter requires mip map or not.
     * @param minFilter min filter type
     */
    protected __needMipmap(minFilter: number): boolean {
        return Texture._filtersNeedsMipmap.indexOf(minFilter) > -1;
    }

    /**
     * Apply texParameteri parameters before updating texture
     */
    protected __applyTexParameter(): void {
        if (!this._texParameterChanged) {
            return;
        }
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_MIN_FILTER, this._minFilter);
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_MAG_FILTER, this._magFilter);
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_WRAP_S, this._wrapS);
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_WRAP_T, this._wrapT);
        this._texParameterChanged = false;
    }

    // There should be more effective way to resize texture
    private _ensureImagePOT(img: HTMLImageElement): IResizeResult {
        const w = img.naturalWidth, h = img.naturalHeight;
        const size = TextureSizeCalculator.getPow2Size(w, h);
        if (w !== size.width || h !== size.height) {
            return {
                result: this._resizeImageOrVideo(img, size.width, size.height),
                height: size.height,
                width: size.width,
            };
        }
        return {
            result: img,
            width: w,
            height: h,
        };
    }

    private _ensureCanvasPOT(canvas: HTMLCanvasElement): IResizeResult {
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

    private _ensureVideoPOT(video: HTMLVideoElement): IResizeResult {
        const w = video.videoWidth, h = video.videoHeight;
        const size = TextureSizeCalculator.getPow2Size(w, h); // largest 2^n integer that does not exceed s
        if (w !== size.width || h !== size.height) {
            return {
                result: this._resizeImageOrVideo(video, size.width, size.height),
                width: size.width,
                height: size.height,
            };
        }
        return {
            result: video,
            width: w,
            height: h,
        };
    }

    private _resizeImageOrVideo(resource: HTMLImageElement | HTMLVideoElement, width: number, height: number): HTMLCanvasElement {
        const canv = Texture._resizerCanvas;
        canv.height = height;
        canv.width = width;
        Texture._resizerContext.drawImage(resource, 0, 0, resource.width, resource.height, 0, 0, width, height);
        return Texture._resizerCanvas;
    }
}
