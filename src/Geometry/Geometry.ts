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
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import GLUtility from "../Resource/GLUtility";

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

export interface ReactiveAttributeBufferDeclaration {
    bufferIndex: number;
    dependentAttributes: string[];
    generator: ReactiveAttributeGenerator | ReactiveIndexGenerator;
    isIndex: boolean;
}

/** 
 * ReactiveAttributeGenerator will update buffer of Geometry when dependent reactive attributes are changed.
 * Generator needs to update buffer passed as 1st arguments by using attributes passed as 2nd argument.
 * Generator also needs to return ReactiveAttributeGenerationResult for accseessor information and VertexBufferUploadOption.
*/
export interface ReactiveAttributeGenerator {
    (buffer: Buffer, attributes: { [key: string]: any }): ReactiveAttributeGenerationResult
}
/** 
 * Result of ReactiveAttributeGenerator.
*/
export interface ReactiveAttributeGenerationResult {
    /** 
     * Accessor of buffers.
    */
    accessors: { [semantcis: string]: Options<VertexBufferAccessor> };
    /** 
     * Option of vertex buffer upload option.
    */
    opt?: Options<VertexBufferUploadOptions>;
}

export interface ReactiveIndexGenerator {
    /** 
 * ReactiveIndexGenerator will update buffer of Geometry when dependent reactive attributes are changed.
 * Generator needs to update buffer passed as 1st arguments by using attributes passed as 2nd argument.
 * Generator also needs to return Option<IndexBufferUploadOptions>
*/
    (buffer: Buffer, attributes: { [key: string]: any }): Options<IndexBufferUploadOptions>;
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
     * Buffers used in this geometry.
     * Buffer indices can be found on bufferIndex attribute in GeonetryVertexBufferAccessor or IndexBufferInfo
     * @type {Buffer[]}
     */
    public buffers: Buffer[] = [];

    /**
     * Index buffer accessing information.
     * This information will be used for each time to be rendered.
     * You shouldn't write directly to this field. Use addIndexBuffer or addReactiveIndexBuffer instead.
     */
    public indices: { [geometryType: string]: IndexBufferInfo } = {};

    /**
     * Vertex buffer accessor information
     * You shouln't write directly to this field. Use addVertexBuffer or addReactiveVertexBuffer instead.
     */
    public accessors: { [semantics: string]: GeometryVertexBufferAccessor } = {};

    /**
     * Declarations of reactive attributes.
     * You shouldn't write directly to this field. Use addReactiveAttributeBuffer instead.
     */
    public reactiveAttributeBufferDeclarations: ReactiveAttributeBufferDeclaration[] = [];
    // TODO: Update aabb correctly
    public aabb: AABB = new AABB([Vector3.Zero]);

    private _accessorHashCache = 0;

    constructor(public gl: WebGLRenderingContext, public reactiveAttributes: { [key: string]: any } = {}) {
        // TODO: Migrate all instanciated geometries
        // GLExtRequestor.request("ANGLE_instanced_arrays", true);
        // this.instanciator = GLExtRequestor.get(gl).extensions["ANGLE_instanced_arrays"];
    }

    /**
     * Define an attribute of geometry with default value.
     * This must be called before using this value in addReactiveAttributeBuffer or addReactiveIndexBuffer
     * @param key Name of geometry attribute
     * @param defaultValue value of default value
     */
    public declareReactiveAttribute(key: string, defaultValue: any): void {
        if (defaultValue === undefined) {
            throw new Error("Reactive attribute can't take undefined as a value");
        }
        if (!this.reactiveAttributes[key]) {
            this.reactiveAttributes[key] = defaultValue;
        }
    }
    /**
     * Assign reactive attribute manually.
     * This method can invoke updating geometry.(Can be heavy if you call this method frequently)
     * If you want to assign 2 or more attribute at 1 time, you should use setReactiveAttributes instead.
     * @param key Key of reactive attribute
     * @param value value to assign
     */
    public setReactiveAttribute(key: string, value: any): void {
        this.setReactiveAttributes({ [key]: value });
    }

    /**
     * Assign group of attribute manually.
     * This method can invoke updating geometry.(Can be heavy if you call this method frequently)
     * @param args 
     */
    public setReactiveAttributes(args: { [key: string]: any }): void {
        const updatableAttributes: string[] = [];
        for (const key in args) {
            const value = args[key];
            if (this.reactiveAttributes[key] === void 0) {
                throw new Error(`Specified reactive attribute "${key}" is not existing.`);
            }
            if (value === void 0 || this.reactiveAttributes[key] === value) {
                continue;
            }
            this.reactiveAttributes[key] = value;
            updatableAttributes.push(key);
        }
        this.reactiveAttributeBufferDeclarations.forEach(raDecl => {
            if (raDecl.dependentAttributes.filter(a => updatableAttributes.includes(a)).length > 0) {
                this._callReactiveUpdator(raDecl);
            }
        });
    }

    /**
     * Add reactive attribute buffer.
     * Geometry will call generator function if dependentReactiveAttributes value was changed.
     * Generator will be called at registering timing.
     * @param dependentReactiveAttributes array of attribute names to rise updating buffer
     * @param generator generator of reactive attribute generator.
     */
    public addReactiveAttributeBuffer(dependentReactiveAttributes: string[], generator: ReactiveAttributeGenerator): void {
        const buffer = new Buffer(this.gl, WebGLRenderingContext.ARRAY_BUFFER);
        const raDecl = {
            bufferIndex: this.buffers.length,
            dependentAttributes: dependentReactiveAttributes,
            generator,
            isIndex: false
        };
        this.reactiveAttributeBufferDeclarations.push(raDecl);
        this.buffers.push(buffer);
        this._callReactiveUpdator(raDecl);
    }

    /**
     * Add reactive index buffer.
     * Geometry will call generator function if dependentReactiveAttributes value was changed.
     * Generator will be called at registering timing.
     * @param dependentReactiveAttributes array of attribute names to rise updating buffer
     * @param generator generator of reactive attribute generator.
     */
    public addReactiveIndexBuffer(dependentReactiveAttributes: string[], generator: ReactiveIndexGenerator): void {
        const buffer = new Buffer(this.gl, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER);
        const raDecl = {
            bufferIndex: this.buffers.length,
            dependentAttributes: dependentReactiveAttributes,
            generator,
            isIndex: true
        };
        this.reactiveAttributeBufferDeclarations.push(raDecl);
        this.buffers.push(buffer);
        this._callReactiveUpdator(raDecl);
    }

    public addAttributeBuffer(buffer: GrimoireBufferSource, accessors: { [semantcis: string]: Options<VertexBufferAccessor> }, opt?: Options<VertexBufferUploadOptions>): void {
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
    public addIndexBuffer(buffer?: GrimoireBufferSource, opt?: Options<IndexBufferUploadOptions>): void {
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
     * Call reactive updator for buffers.
     * @param raDecl 
     */
    private _callReactiveUpdator(raDecl: ReactiveAttributeBufferDeclaration): void {
        const buffer = this.buffers[raDecl.bufferIndex];
        if (raDecl.isIndex) {
            const generated = (raDecl.generator as ReactiveIndexGenerator)(buffer, this.reactiveAttributes);
            const option = Geometry._ensureValidIndexBufferUploadOptions(buffer, generated);
            this.indices[option.semantic ? option.semantic : "@@WITHOUT_INDEX"] = {
                byteOffset: option.offset,
                byteSize: GLConstantUtility.getElementByteSize(option.type),
                type: option.type,
                topology: option.topology,
                count: option.count,
                index: this.buffers[raDecl.bufferIndex]
            };
        } else {
            const generated = (raDecl.generator as ReactiveAttributeGenerator)(buffer, this.reactiveAttributes);
            const option = Geometry._ensureValidVertexBufferUploadOptions(generated.accessors, generated.opt);
            for (const semantic in generated.accessors) {
                let accessor = generated.accessors[semantic] as Options<GeometryVertexBufferAccessor>;
                this.accessors[semantic] = Geometry._ensureValidVertexBufferAccessor(buffer, accessor, raDecl.bufferIndex, semantic);;
            }
        }
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
        if (!buffer && (!opt || typeof opt.type === "number")) {
            throw new Error(`Index buffer can't construct without buffer and opt.type`);
        }
        let type!: number;
        if (opt && opt.type) {
            type = opt.type;
        }
        if (buffer instanceof Buffer) {
            type = buffer.elementType!;
        } else if (buffer) {
            type = GLConstantUtility.getSuitableIntegerElementTypeFromMaximum(Math.max(...buffer as any))
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
            type,
            ...opt
        };
    }

    private static _getGrimoireBufferSourceCount(source: GrimoireBufferSource): number {
        if (source instanceof Buffer) {
            if (!source.length) {
                throw new Error(`Specified buffer has no length information. Have you called update before using in geometry?`);
            }
            return source.length;
        }
        if (Array.isArray(source)) {
            return source.length;
        }
        throw new Error(`Can't fetch length of buffer from specified resource`);
    }

    private static _suggestVertexAttributeTypeFromBuffer(buffer: GrimoireBufferSource): number {
        if (Array.isArray(buffer) || buffer instanceof ArrayBuffer) {
            return WebGLRenderingContext.FLOAT;
        }
        if (buffer instanceof Buffer) {
            if (!buffer.elementType) {
                throw new Error(`Specified buffer has no elementType information. Have you called update before using in geometry?`);
            }
            return buffer.elementType;
        }
        return GLConstantUtility.getElementTypeFromTypedArrayConstructor((buffer as any).constructor);
    }
}

