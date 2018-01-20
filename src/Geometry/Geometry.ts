import AABB from "grimoirejs-math/ref/AABB";
import Vector3 from "grimoirejs-math/ref/Vector3";
import Buffer from "../Resource/Buffer";
import IGLInstancedArrayInterface from "../Resource/GLExt/IGLInstancedArrayInterface";
import GLExtRequestor from "../Resource/GLExtRequestor";
import Program from "../Resource/Program";
import GLConstantUtility from "../Util/GLConstantUtility";
import HashCalculator from "../Util/HashCalculator";
import IndexBufferInfo from "./IndexBufferInfo";
import VertexBufferAccessor from "./VertexBufferAccessor";

export type Undef<T> = undefined | T;
export type Options<T> = {
    [key in keyof T]: T[key]
};

export interface GeometryVertexBufferAccessor extends VertexBufferAccessor {
    bufferIndex: number;
}

export interface VertexBufferUploadOptions {
    usage: number;
    keepOnBuffer: boolean;
}
/**
 * The geometry class for managing buffer resource
 */
export default class Geometry {

    private static _lastGeometry: Map<WebGLRenderingContext, Geometry> = new Map<WebGLRenderingContext, Geometry>();

    /**
     * bind a vertex buffer to specified attribute variable.
     * @param  {Geometry} geometry      [description]
     * @param  {Program}  program       [description]
     * @param  {string}   attributeName [description]
     * @param  {string}   semantics    [description]
     * @return {boolean}                [description]
     */
    public static bindBufferToAttribute(geometry: Geometry, program: Program, attributeName: string, semantics: string): boolean {
        const index = program.findAttributeLocation(attributeName);
        if (index < 0) {
            return false;
        }
        const accessors = geometry.accessors[semantics];
        if (!accessors) { // when the accessor was not existing
            throw new Error(`Specified buffer "${semantics} was not found on this geometry while attempt to bind "${attributeName}" of attribute variables.\n
      All of the vertex buffer available on this geometry is ${Object.keys(geometry.accessors)}"`);
        }
        const buffer = geometry.buffers[accessors.bufferIndex];
        buffer.bind();
        program.gl.vertexAttribPointer(index, accessors.size, accessors.type, accessors.normalized, accessors.stride, accessors.offset);
        if (accessors.instancingDivisor > 0) {
            geometry.instanciator.vertexAttribDivisorANGLE(index, accessors.instancingDivisor);
        }
        return true;
    }

    public static drawWithCurrentVertexBuffer(geometry: Geometry, indexName: string, count: number = Number.MAX_VALUE, offset = 0): void {
        const targetIndex = geometry.indices[indexName];
        if (targetIndex === void 0) {
            throw new Error(`Specified index buffer "${indexName}" was not found on this geometry.All of the index buffer available on this geometry is "${Object.keys(geometry.indices)}"`);
        }
        targetIndex.index.bind();
        if (targetIndex.instanceCount > 0) {
            geometry.instanciator.drawElementsInstancedANGLE(targetIndex.topology, Math.min(targetIndex.count, count), targetIndex.type, Math.min(offset * targetIndex.byteSize + targetIndex.byteOffset, targetIndex.byteOffset + (targetIndex.count - 1) * targetIndex.byteSize), targetIndex.instanceCount);
        } else {
            targetIndex.index.gl.drawElements(targetIndex.topology, Math.min(targetIndex.count, count), targetIndex.type, Math.min(offset * targetIndex.byteSize + targetIndex.byteOffset, targetIndex.byteOffset + (targetIndex.count - 1) * targetIndex.byteSize));
        }
    }

    /**
     * Hash calculator of accessors map.
     * If this value was same with the other geometry, the 2 geometries have same accessors.
     * 'Same' DOES NOT mean that these geometries have a buffers containing same elements.
     * But, if there was a accessor named 'A' in one of them, the other one should exist.
     */
    public get accessorHash(): number {
        return this._accessorHashCache;
    }
    /**
     * Vertex buffer
     * @type {Buffer[]}
     */
    public buffers: Buffer[] = [];

    public indices: { [geometryType: string]: IndexBufferInfo } = {};

    public accessors: { [semantics: string]: GeometryVertexBufferAccessor } = {};

    public aabb: AABB = new AABB([Vector3.Zero]);

    private instanciator: IGLInstancedArrayInterface;

    private _accessorHashCache = 0;

    constructor(public gl: WebGLRenderingContext) {
        GLExtRequestor.request("ANGLE_instanced_arrays", true);
        this.instanciator = GLExtRequestor.get(gl).extensions["ANGLE_instanced_arrays"];
    }

    public addAttributes(buffer: number[] | BufferSource | Buffer, accessors: { [semantcis: string]: VertexBufferAccessor }, opt: Options<VertexBufferUploadOptions>): void {
        const index = this.buffers.length;
        for (const semantic in accessors) {
            const accessor = accessors[semantic] as GeometryVertexBufferAccessor;
            Geometry._ensureValidVertexBufferAccessor(accessor, index, semantic, opt.keepOnBuffer);
            this.accessors[semantic] = accessor;
        }
        buffer = this._ensureToBeVertexBuffer(buffer, opt.usage, opt.keepOnBuffer);
        this.buffers.push(buffer);
        this._recalculateAccsessorHash();
    }

    /**
     * add new index buffer to this geometry.
     * @param {string}                       indexName [description]
     * @param {Buffer|number[]|BufferSource} buffer    [description]
     * @param {number                    =         WebGLRenderingContext.TRIANGLES} topology [description]
     * @param {number                    =         0}                               offset   [description]
     * @param {number                    =         null}                            count    [description]
     * @param {number                    =         0}                               type     [description]
     */
    public addIndex(indexName: string, instanceCount: number, buffer: Buffer | number[] | BufferSource, topology?: number, offset?: number, count?: number, type?: number): void;
    public addIndex(indexName: string, buffer: Buffer | number[] | BufferSource, topology?: number, offset?: number, count?: number, type?: number): void;
    public addIndex(indexName: string, bufferOrInstanceCount: Buffer | number[] | BufferSource | number, bufferOrTopology: Buffer | number[] | BufferSource | number, offsetOrTopology: number, countOrOffset: number = null, typeOrCount = 0, type?: number): void {
        let buffer: Buffer | number[] | BufferSource;
        let topology: number;
        let offset: number;
        let count: number;
        let instanceCount: number;
        if (typeof bufferOrInstanceCount === "number") { // instanced
            instanceCount = bufferOrInstanceCount;
            buffer = bufferOrTopology as Buffer | number[] | BufferSource;
            topology = offsetOrTopology;
            offset = countOrOffset;
            count = typeOrCount;
            if (!type) {
                type = 0;
            }
            if (typeof offset !== "number") {
                offset = 0;
            }
            if (typeof topology !== "number") {
                topology = WebGLRenderingContext.TRIANGLES;
            }
        } else {
            buffer = bufferOrInstanceCount;
            topology = bufferOrTopology as number;
            offset = offsetOrTopology;
            count = countOrOffset;
            type = typeOrCount;
            if (typeof topology !== "number") {
                topology = WebGLRenderingContext.TRIANGLES;
            }
            if (typeof offset !== "number") {
                offset = 0;
            }
        }
        if (!count) {
            if ((buffer instanceof Buffer || buffer instanceof ArrayBuffer || buffer instanceof DataView)) {
                throw new Error("The argument 'count' is necessary if you specified buffer with an instance of Buffer or ArrayBuffer");
            } else {
                count = buffer["length"];
            }
        }
        if (type === 0) {
            type = GLConstantUtility.getSuitableElementTypeFromCount(count);
        }
        buffer = this._ensureToBeIndexBuffer(buffer, type);
        this.indices[indexName] = {
            byteOffset: offset,
            byteSize: GLConstantUtility.getElementByteSize(type),
            type,
            topology,
            count,
            index: buffer,
            instanceCount,
        };
    }

    public drawByDefault(indexName: string, attribNames: string[], program: Program, count = Number.MAX_VALUE, offset = 0): void {
        attribNames.forEach(name => {
            Geometry.bindBufferToAttribute(this, program, name, name);
        });
        Geometry.drawWithCurrentVertexBuffer(this, indexName, count, offset);
    }

    public clone(): Geometry {
        const geometry = new Geometry(this.gl);
        geometry.buffers = [].concat(this.buffers);
        geometry.accessors = { ...this.accessors };
        geometry.indices = { ...this.indices };
        geometry.aabb = new AABB([this.aabb.pointLBF, this.aabb.pointRTN]);
        return geometry;
    }

    /**
     * Make sure buffer sources converted into Buffer
     * @param  {Buffer|BufferSource|number[]} buffer [description]
     * @return {Buffer}                              [description]
     */
    private _ensureToBeVertexBuffer(buffer: Buffer | BufferSource | number[], usage: number, keepBuffer: boolean): Buffer {
        if (!(buffer instanceof Buffer)) {
            let bufferSource = buffer;
            if (Array.isArray(bufferSource)) {
                bufferSource = new Float32Array(bufferSource);
            }
            buffer = new Buffer(this.gl, WebGLRenderingContext.ARRAY_BUFFER, usage);
            buffer.keepSource = keepBuffer;
            buffer.update(bufferSource);
        }
        return buffer;
    }

    /**
     * Make sure buffer sources converted into Buffer
     * @param  {Buffer|BufferSource|number[]} buffer [description]
     * @return {Buffer}                              [description]
     */
    private _ensureToBeIndexBuffer(buffer: Buffer | BufferSource | number[], type: number): Buffer {
        if (!(buffer instanceof Buffer)) {
            let bufferSource = buffer;
            if (Array.isArray(bufferSource)) {
                bufferSource = new (GLConstantUtility.getTypedArrayConstructorFromElementType(type))(bufferSource);
            }
            buffer = new Buffer(this.gl, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW);
            buffer.update(bufferSource);
        } else {
            if (buffer.target !== WebGLRenderingContext.ELEMENT_ARRAY_BUFFER) {
                throw new Error("The usage of buffer specified as index buffer is not ELEMENT_ARRAY_BUFFER");
            }
        }
        return buffer;
    }

    private _recalculateAccsessorHash(): void {
        let hashSource = "";
        for (const key in this.accessors) {
            hashSource += key + "|";
        }
        this._accessorHashCache = HashCalculator.calcHash(hashSource);
    }

    private static _ensureValidVertexBufferAccessor(accessor: GeometryVertexBufferAccessor, index: number, semantic: string, keepBuffer: boolean) {
        accessor.bufferIndex = index;
        if (accessor.size === void 0) {
            throw new Error(`Accessor specified with the semantics "${semantic}" is not containing size as paranmeter.`);
        }
        accessor = {
            type: WebGLRenderingContext.FLOAT,
            stride: accessor.size * GLConstantUtility.getElementByteSize(accessor.type),
            offset: 0,
            normalized: false,
            keepOnBuffer: semantic === "POSITION",
            ...accessor
        };
        return accessor;
    }

    private static _ensureValidVertexBufferUploadOptions(opt: VertexBufferUploadOptions): VertexBufferUploadOptions {

    }
}

