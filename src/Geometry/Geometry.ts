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
import Options from "../Util/Options";

export interface GeometryVertexBufferAccessor extends VertexBufferAccessor {
    bufferIndex: number;
}

export interface VertexBufferUploadOptions {
    usage: number;
    keepOnBuffer: boolean;
}

export interface IndexBufferUploadOptions {
    semantic?: string;
    topology: number;
    offset: number;
    count: number;
    type: number;
}

export type GrimoireBufferSource = number[] | BufferSource | Buffer;
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
        // if (accessors.instancingDivisor > 0) {
        //     geometry.instanciator.vertexAttribDivisorANGLE(index, accessors.instancingDivisor);
        // }
        return true;
    }

    public static drawWithCurrentVertexBuffer(geometry: Geometry, indexName: string = "@@WITHOUT_INDEX", count: number = Number.MAX_VALUE, offset = 0): void {
        let targetIndex = geometry.indices[indexName];
        if (!targetIndex) {
            targetIndex = geometry.indices["@@WITHOUT_INDEX"];
        }
        const gl = geometry.gl;
        if (targetIndex === void 0) {
            throw new Error(`Specified index buffer "${indexName}" was not found on this geometry.All of the index buffer available on this geometry is "${Object.keys(geometry.indices)}"`);
        }
        if (targetIndex.index) {
            targetIndex.index.bind();
            gl.drawElements(targetIndex.topology, Math.min(targetIndex.count, count), targetIndex.type, Math.min(offset * targetIndex.byteSize + targetIndex.byteOffset, targetIndex.byteOffset + (targetIndex.count - 1) * targetIndex.byteSize));
        } else {
            gl.bindBuffer(WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, null);
            gl.drawElements(targetIndex.topology, Math.min(targetIndex.count, count), targetIndex.type, Math.min(offset * targetIndex.byteSize + targetIndex.byteOffset, targetIndex.byteOffset + (targetIndex.count - 1) * targetIndex.byteSize));
        }
        //}
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
        // TODO: Migrate all instanciated geometries
        // GLExtRequestor.request("ANGLE_instanced_arrays", true);
        // this.instanciator = GLExtRequestor.get(gl).extensions["ANGLE_instanced_arrays"];
    }

    public addAttributes(buffer: GrimoireBufferSource, accessors: { [semantcis: string]: Options<VertexBufferAccessor> }, opt?: Options<VertexBufferUploadOptions>): void {
        const option = Geometry._ensureValidVertexBufferUploadOptions(accessors, opt);
        const index = this.buffers.length;
        for (const semantic in accessors) {
            let accessor = accessors[semantic] as Options<GeometryVertexBufferAccessor>;
            this.accessors[semantic] = Geometry._ensureValidVertexBufferAccessor(buffer, accessor, index, semantic);;
        }
        buffer = this._ensureToBeVertexBuffer(buffer, option.usage, option.keepOnBuffer);
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
    // public addIndex(indexName: string, instanceCount: number, buffer: Buffer | number[] | BufferSource, topology?: number, offset?: number, count?: number, type?: number): void;
    public addIndex(buffer?: GrimoireBufferSource, opt?: Options<IndexBufferUploadOptions>): void {
        const option = Geometry._ensureValidIndexBufferUploadOptions(buffer, opt);
        buffer = this._ensureToBeIndexBuffer(buffer, option.type);
        this.indices[option.semantic ? option.semantic : "@@WITHOUT_INDEX"] = {
            byteOffset: option.offset,
            byteSize: GLConstantUtility.getElementByteSize(option.type),
            type: option.type,
            topology: option.topology,
            count: option.count,
            index: buffer
        };
    }

    public drawByDefault(indexName: string, attribNames: string[], program: Program, count = Number.MAX_VALUE, offset = 0): void {
        attribNames.forEach(name => {
            Geometry.bindBufferToAttribute(this, program, name, name);
        });
        Geometry.drawWithCurrentVertexBuffer(this, indexName, count, offset);
    }

    public clone(): Geometry {
        // TODO: (type) Check this program works
        const geometry = new Geometry(this.gl);
        geometry.buffers = ([] as Buffer[]).concat(this.buffers);
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
    private _ensureToBeVertexBuffer(buffer: GrimoireBufferSource, usage: number, keepBuffer: boolean): Buffer {
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
    private _ensureToBeIndexBuffer(buffer: Buffer | BufferSource | number[] | undefined, type: number): Buffer | undefined {
        if (buffer === undefined) {
            return undefined;
        }
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

    private static _ensureValidVertexBufferAccessor(buffer: GrimoireBufferSource, accessor: Options<GeometryVertexBufferAccessor>, index: number, semantic: string): GeometryVertexBufferAccessor {
        if (accessor.size === void 0) {
            throw new Error(`Accessor specified with the semantics "${semantic}" is not containing size as paranmeter.`);
        }
        let result = {
            type: Geometry._suggestVertexAttributeTypeFromBuffer(buffer),
            offset: 0,
            normalized: false,
            bufferIndex: index, // This property is determined by Geometry automatically.
            ...accessor
        } as GeometryVertexBufferAccessor;
        result = {
            stride: result.size * GLConstantUtility.getElementByteSize(result.type),
            ...result
        }
        return result;
    }

    private static _ensureValidVertexBufferUploadOptions(accessors: { [key: string]: Options<GeometryVertexBufferAccessor> }, opt?: Options<VertexBufferUploadOptions>): VertexBufferUploadOptions {
        let keepOnBuffer = false;
        for (let key in accessors) {
            if (key === "POSITION") {
                keepOnBuffer = true;
                break;
            }
        }
        return {
            usage: WebGLRenderingContext.STATIC_DRAW,
            keepOnBuffer: keepOnBuffer,
            ...opt,
        }
    }

    private static _ensureValidIndexBufferUploadOptions(buffer?: GrimoireBufferSource, opt?: Options<IndexBufferUploadOptions>): IndexBufferUploadOptions {
        if (!buffer && (!opt || typeof opt.count === "number")) {
            throw new Error(`Index buffer can't construct without buffer and opt.count`);
        }
        let count: number;
        if (opt && opt.count) {
            count = opt.count;
        } else {
            count = Geometry._getGrimoireBufferSourceCount(buffer!);
        }
        return {
            topology: WebGLRenderingContext.TRIANGLES,
            offset: 0,
            count,
            type: GLConstantUtility.getSuitableElementTypeFromCount(count),
            ...opt
        };
    }

    private static _getGrimoireBufferSourceCount(source: GrimoireBufferSource): number {
        if (source instanceof Buffer) {
            throw new Error(`Can't fetch length of buffer from fundamental.Resource.Buffer`);
        }
        if (Array.isArray(source)) {
            return source.length;
        }
        throw new Error(`Can't fetch length of buffer from specified resource`);
    }

    private static _suggestVertexAttributeTypeFromBuffer(buffer: GrimoireBufferSource): number {
        if (Array.isArray(buffer) || buffer instanceof Buffer || buffer instanceof ArrayBuffer) {
            return WebGLRenderingContext.FLOAT;
        }
        return GLConstantUtility.getElementTypeFromTypedArrayConstructor((buffer as any).constructor);
    }
}

