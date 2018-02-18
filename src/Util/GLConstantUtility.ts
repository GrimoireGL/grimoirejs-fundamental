export type TypedArray = Float32Array | Uint8Array | Int8Array | Uint16Array | Int16Array | Uint32Array | Int32Array;
/**
 * Provides utility methods for converting constants like
 * * Buffer element type and typed array constructor
 * * Buffer element type and Buffer element byte size
 *  ...
 */
export default class GLConstantUtility {

    public static isTypedArrayBuffer(arrayBuffer: any): arrayBuffer is TypedArray {
        return arrayBuffer instanceof Float32Array || arrayBuffer instanceof Uint8Array || arrayBuffer instanceof Int8Array || arrayBuffer instanceof Uint16Array || arrayBuffer instanceof Int16Array || arrayBuffer instanceof Uint32Array || arrayBuffer instanceof Int32Array;
    }

    public static getElementTypeFromTypedArray(array: TypedArray): number {
        return GLConstantUtility.getElementTypeFromTypedArrayConstructor(array.constructor as any);
    }
    /**
     * Get size of GL element type
     * @param type gl.FLOAT,gl.UNSIGNED_BYTE,gl_BYTE...
     */
    public static getElementByteSize(type: number): number {
        const wgc = WebGLRenderingContext;
        switch (type) {
            case wgc.UNSIGNED_INT:
            case wgc.INT:
            case wgc.FLOAT:
                return 4;
            case wgc.UNSIGNED_SHORT:
            case wgc.SHORT:
                return 2;
            case wgc.BYTE:
            case wgc.UNSIGNED_BYTE:
                return 1;
            default:
                throw new Error(`Unknown gl element type ${type}`);
        }
    }

    /**
     * Obtain maximum count of specified index buffer type.
     * @param indexType gl element type to be specified as index buffer type
     */
    public static getMaxElementCountOfIndex(indexType: number): number {
        const wgc = WebGLRenderingContext;
        switch (indexType) {
            case wgc.UNSIGNED_BYTE:
                return 256;
            case wgc.UNSIGNED_SHORT:
                return 65536;
            case wgc.UNSIGNED_INT:
                return 4294967296;
            default:
                throw new Error(`${indexType} is not suitable for index buffer`);
        }
    }

    /**
     * Get typed array constructor from gl element type
     * @param type
     */
    public static getTypedArrayConstructorFromElementType(type: number): new (buffer: number[], offset?: number, length?: number) => ArrayBufferView {
        const wgc = WebGLRenderingContext;
        switch (type) {
            case wgc.UNSIGNED_BYTE:
                return Uint8Array;
            case wgc.BYTE:
                return Int8Array;
            case wgc.UNSIGNED_SHORT:
                return Uint16Array;
            case wgc.SHORT:
                return Int16Array;
            case wgc.UNSIGNED_INT:
                return Uint32Array;
            case wgc.INT:
                return Int32Array;
            case wgc.FLOAT:
                return Float32Array;
            default:
                throw new Error(`Unknown typed array constructor for element type ${type}`);
        }
    }

    /**
     * Get gl element type number from typed array constructor
     * @param ctor
     */
    public static getElementTypeFromTypedArrayConstructor(ctor: new (buffer: number[], offset?: number, length?: number) => ArrayBufferView): number {
        const wgc = WebGLRenderingContext;
        const types = [wgc.UNSIGNED_BYTE, wgc.BYTE, wgc.UNSIGNED_SHORT, wgc.SHORT, wgc.UNSIGNED_INT, wgc.INT, wgc.FLOAT];
        for (let i = 0; i < types.length; i++) {
            if (GLConstantUtility.getTypedArrayConstructorFromElementType(types[i]) === ctor) {
                return types[i];
            }
        }
        throw new Error("Provided typed array constructor is not suitable for gl resource");
    }

    /**
     * Obtain suitable integer typedarray from maximum array element.
     * @param maximum Maximum of array element
     * @param signed If the array need to have signed.
     */
    public static getSuitableIntegerElementTypeFromMaximum(maximum: number, signed = false): number {
        const wgc = WebGLRenderingContext;
        const types = [wgc.UNSIGNED_BYTE, wgc.UNSIGNED_SHORT, wgc.UNSIGNED_INT];
        if (signed) { // If signed, maximum of unsigned must be twice of specified maximum
            maximum *= 2;
        }
        for (let i = 0; i < types.length; i++) {
            if (maximum <= GLConstantUtility.getMaxElementCountOfIndex(types[i])) {
                return signed ? types[i] - 1 : types[i]; // types[i] - 1 means signed version of the unsigned.
            }
        }
        throw new Error(`Suitable element type was not found since ${maximum} is too large for WebGL buffer`);
    }

    /**
     * Obtain Integer element type from specified array.
     * This method will call getSuitableIntegerElementTypeFromMaximum with calculated maximum of the array.
     * @param array 
     */
    public static getSuitableIntegerElementTypeFromArray(array: number[]): number {
        const max = Math.max(...array);
        return GLConstantUtility.getSuitableIntegerElementTypeFromMaximum(max);
    }

    /**
     * Count element of specified gl format.
     * @param format
     */
    public static getElementCount(format: number): number {
        switch (format) {
            case WebGLRenderingContext.RGBA:
                return 4;
            case WebGLRenderingContext.RGB:
                return 3;
            default:
                throw new Error(`Format ${format} is unknown`);
        }
    }

    /**
     * Returns specified filter using mipmap or not
     * @param filter
     */
    public static isUsingMipmap(filter: number): boolean {
        switch (filter) {
            case WebGLRenderingContext.LINEAR_MIPMAP_LINEAR:
            case WebGLRenderingContext.LINEAR_MIPMAP_NEAREST:
            case WebGLRenderingContext.NEAREST_MIPMAP_LINEAR:
            case WebGLRenderingContext.NEAREST_MIPMAP_NEAREST:
                return true;
            default:
                return false;
        }
    }
    /**
     * Create filter argument of gl.clear from clear flags.
     * @param clearColor
     * @param clearDepth
     */
    public static createClearFilter(clearColor?: boolean, clearDepth?: boolean): number {
        let result = 0;
        if (clearColor) {
            result |= WebGLRenderingContext.COLOR_BUFFER_BIT;
        }
        if (clearDepth) {
            result |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
        }
        return result;
    }
}
