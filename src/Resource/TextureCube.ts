import { Nullable } from "grimoirejs/ref/Tool/Types";
import GLConstantUtility from "../Util/GLConstantUtility";
import ICubemapSource from "./ICubemapSource";
import IElementOfCubemapDirection from "./IElementOfCubemapDirection";
import ITextureUploadConfig from "./ITextureUploadConfig";
import Texture from "./Texture";

/**
 * Cube map texture
 */
export default class TextureCube extends Texture {

    public static defaultTextures: Map<WebGLRenderingContext, TextureCube> = new Map<WebGLRenderingContext, TextureCube>();

    public static imageDirections: IElementOfCubemapDirection<number> = {
        PX: WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_X,
        NX: WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_X,
        PY: WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Y,
        NY: WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Y,
        PZ: WebGLRenderingContext.TEXTURE_CUBE_MAP_POSITIVE_Z,
        NZ: WebGLRenderingContext.TEXTURE_CUBE_MAP_NEGATIVE_Z,
    };

    /**
     * Obtain default texture that is used when valid texture is not specified.
     * @param gl
     */
    public static getDefaultTexture(gl: WebGLRenderingContext): TextureCube {
        let defaultTexture = TextureCube.defaultTextures.get(gl);
        if (!defaultTexture) {
            const cube = new TextureCube(gl);
            const source = new Uint8Array([0, 0, 0, 0]);
            cube.updateDirectly(1, 1, {
                PX: source, PY: source, PZ: source, NX: source, NY: source, NZ: source,
            });
            defaultTexture = cube;
            TextureCube.defaultTextures.set(gl, defaultTexture);
        }
        return defaultTexture;
    }

    /**
     * Width of single texture.
     * Can be null if texture haven't updated.
     */
    public width: Nullable<number> = null;

    /**
     * Height of single texture.
     * Can be null if texture haven't updated.
     */
    public height: Nullable<number> = null;

    constructor(gl: WebGLRenderingContext) {
        super(gl, WebGLRenderingContext.TEXTURE_CUBE_MAP);
    }

    /**
     * Update cubemap texture with specified source.
     */
    public updateWithResource(source: ICubemapSource, uploadConfig?: ITextureUploadConfig): void {
        this.gl.bindTexture(this.textureType, this.resourceReference);
        this.__prepareTextureUpload(uploadConfig, { flipY: false, premultipliedAlpha: false });
        for (const key in TextureCube.imageDirections) {
            const resize = this.__updateWithSourceImage((TextureCube.imageDirections as any)[key], (source as any)[key]);
            this.width = resize.width;
            this.height = resize.height;
        }
        this.__ensureMipmap();
        this.valid = true;
    }
    /**
     * Update texture with specified buffers
     */
    public updateDirectly(width: number, height: number, buffers: IElementOfCubemapDirection<ArrayBufferView> = {} as any, format = WebGLRenderingContext.RGBA, type = WebGLRenderingContext.UNSIGNED_BYTE, level = 0, uploadConfig?: ITextureUploadConfig): void {
        this.gl.bindTexture(this.textureType, this.resourceReference);
        this.__prepareTextureUpload(uploadConfig);
        this.width = width;
        this.height = height;
        for (const dir in TextureCube.imageDirections) {
            this.gl.texImage2D((TextureCube.imageDirections as any)[dir], level, format, width, height, 0, format, type, (buffers as any)[dir] || new Uint8Array(width * height * GLConstantUtility.getElementCount(format)));
        }
        this.__ensureMipmap();
        this.valid = true;
    }
}
