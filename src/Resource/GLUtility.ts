export type TypedArrayConstructor = (new (length: number) => ArrayBufferView) & (new (array: ArrayLike<number>) => ArrayBufferView) & (new (buffer: ArrayBufferLike, byteOffset?: number, length?: number) => ArrayBufferView);
/**
 * Provides misc features for WebGL.
 * Typically not limited to specific context.
 */
export default class GLUtility {
    /**
     * Obtain typed array constructor from GL type.
     * @param type
     */
    public static typeToTypedArrayConstructor(type: number): TypedArrayConstructor {
        switch (type) {
            case WebGLRenderingContext.UNSIGNED_BYTE:
                return Uint8Array;
            case WebGLRenderingContext.UNSIGNED_SHORT:
                return Uint16Array;
            case WebGLRenderingContext.UNSIGNED_INT:
                return Uint32Array;
            case WebGLRenderingContext.BYTE:
                return Int8Array;
            case WebGLRenderingContext.SHORT:
                return Int16Array;
            case WebGLRenderingContext.INT:
                return Int32Array;
            case WebGLRenderingContext.FLOAT:
                return Float32Array;
            default:
                throw new Error(`Element type ${type} is not valid for buffer elements`);
        }
    }

    /**
     * Obtain GL type from typed array buffer view.
     * @param buffer
     */
    public static arrayBufferToElementType(buffer: ArrayBufferView) {
        if (buffer instanceof Uint8Array) {
            return WebGLRenderingContext.UNSIGNED_BYTE;
        }
        if (buffer instanceof Uint16Array) {
            return WebGLRenderingContext.UNSIGNED_SHORT;
        }
        if (buffer instanceof Uint32Array) {
            return WebGLRenderingContext.UNSIGNED_INT;
        }
        if (buffer instanceof Int8Array) {
            return WebGLRenderingContext.BYTE;
        }
        if (buffer instanceof Int16Array) {
            return WebGLRenderingContext.SHORT;
        }
        if (buffer instanceof Int32Array) {
            return WebGLRenderingContext.INT;
        }
        if (buffer instanceof Float32Array) {
            return WebGLRenderingContext.FLOAT;
        }
        throw new Error("Unknown buffer element type");
    }

    /**
     *
     * @param format
     */
    public static formatToElementCount(format: number): number {
        switch (format) {
            case WebGLRenderingContext.RGBA:
                return 4;
            case WebGLRenderingContext.RGB:
                return 3;
            default:
                throw new Error("Unknown buffer format");
        }
    }
}
