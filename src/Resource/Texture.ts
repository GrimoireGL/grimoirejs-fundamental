import GLConstantUtility from "../Util/GLConstantUtility";
import TextureSizeCalculator from "../Util/TextureSizeCalculator";
import GLResource from "./GLResource";
import GLUtility from "./GLUtility";
import ImageSource from "./ImageSource";
import IResizeResult from "./IResizeResult";
import ITextureUploadConfig from "./ITextureUploadConfig";
export default abstract class Texture extends GLResource<WebGLTexture> {

    private static _resizerCanvas: HTMLCanvasElement = document.createElement("canvas");

    private static _resizerContext = Texture._resizerCanvas.getContext("2d")!;

    public get magFilter(): number {
        return this._magFilter;
    }

    public set magFilter(filter: number) {
        if (this._magFilter !== filter) {
            this.__texParameterChanged = true;
            this._magFilter = filter;
        }
    }

    public get minFilter(): number {
        return this._minFilter;
    }

    public set minFilter(filter: number) {
        if (this._minFilter !== filter) {
            this.__texParameterChanged = true;
            this._minFilter = filter;
            this.__ensureMipmap();
        }
    }

    public get wrapS(): number {
        return this._wrapS;
    }

    public set wrapS(filter: number) {
        if (this._wrapS !== filter) {
            this.__texParameterChanged = true;
            this._wrapS = filter;
        }
    }

    public get wrapT(): number {
        return this._wrapT;
    }

    public set wrapT(filter: number) {
        if (this._wrapT !== filter) {
            this.__texParameterChanged = true;
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

    protected __texParameterChanged = true;

    private _magFilter: number = WebGLRenderingContext.LINEAR;

    private _minFilter: number = WebGLRenderingContext.LINEAR_MIPMAP_NEAREST;

    private _wrapS: number = WebGLRenderingContext.REPEAT;

    private _wrapT: number = WebGLRenderingContext.REPEAT;

    constructor(gl: WebGLRenderingContext, public textureType: number) {
        super(gl, gl.createTexture()!);
    }

    /**
     * Should be called after rendering into this texture.
     * This must be called before used as resource in next rendering.
     */
    public afterRender(): void {
        this.__ensureMipmap(); // recalculate mipmap if needed
    }

    public destroy(): void {
        super.destroy();
        this.gl.deleteTexture(this.resourceReference);
    }

    public register(registerNumber: number): void {
        if (!this.valid) {
            return;
        }
        // TODO: (performance) disable texture after use?
        // Or reduce calling of activate texture
        this.gl.activeTexture(WebGLRenderingContext.TEXTURE0 + registerNumber);
        this.gl.bindTexture(this.textureType, this.resourceReference);
        this.__applyTexParameter();
    }

    protected __prepareTextureUpload(uploadConfig: ITextureUploadConfig, complement = { flipY: true, premultipliedAlpha: false }): void {
        uploadConfig = {
            ...complement,
            ...uploadConfig
        };
        this.gl.pixelStorei(WebGLRenderingContext.UNPACK_FLIP_Y_WEBGL, uploadConfig.flipY ? 1 : 0);
        this.gl.pixelStorei(WebGLRenderingContext.UNPACK_PREMULTIPLY_ALPHA_WEBGL, uploadConfig.premultipliedAlpha ? 1 : 0);
    }

    /**
     * Simply update texture. This method can resize source if need.
     * @param target
     * @param source
     * @param format
     * @param level
     */
    protected __updateWithSourceImage(target: number, source: ImageSource, format = WebGLRenderingContext.RGBA, level = 0): IResizeResult {
        const resizedResource = this.__ensurePOT(source);
        this.gl.texImage2D(target, level, format, format, WebGLRenderingContext.UNSIGNED_BYTE, resizedResource.result);
        this.__type = WebGLRenderingContext.UNSIGNED_BYTE;
        this.__format = format;
        return resizedResource;
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
    protected __ensurePOT(image: ImageSource): IResizeResult {
        if (image instanceof ImageData) {
            const context = document.createElement("canvas").getContext("2d")!;
            context.canvas.width = image.width;
            context.canvas.height = image.height;
            context.putImageData(image, 0, 0);
            image = context.canvas;
        }
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

    protected __ensureMipmap(): void {
        if (this.valid && GLConstantUtility.isUsingMipmap(this.minFilter)) {
            this.gl.bindTexture(this.textureType, this.resourceReference);
            this.gl.generateMipmap(this.textureType);
        }
    }

    /**
     * Apply texParameteri parameters before updating texture
     * Return true if texture parameter need to updated(When __texParameterChanged flag is true)
     */
    protected __applyTexParameter(): boolean {
        if (!this.__texParameterChanged) {
            return false;
        }
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_MIN_FILTER, this._minFilter);
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_MAG_FILTER, this._magFilter);
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_WRAP_S, this._wrapS);
        this.gl.texParameteri(this.textureType, WebGLRenderingContext.TEXTURE_WRAP_T, this._wrapT);
        this.__ensureMipmap();
        this.__texParameterChanged = false;
        return true;
    }

    protected __onValid(): void {
        this.__ensureMipmap();
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
