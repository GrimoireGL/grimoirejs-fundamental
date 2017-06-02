import Vector3 from "grimoirejs-math/ref/Vector3";
import AABB from "grimoirejs-math/ref/AABB";
import VertexBufferAccessor from "./VertexBufferAccessor";
import Program from "../Resource/Program";
import IndexBufferInfo from "./IndexBufferInfo";
import Buffer from "../Resource/Buffer"

export interface GeometryVertexBufferAccessor extends VertexBufferAccessor {
  bufferIndex: number;
}
/**
 * The geometry class for managing buffer resource
 */
export default class Geometry {

  private static _lastGeometry: Map<WebGLRenderingContext, Geometry> = new Map<WebGLRenderingContext, Geometry>();

  /**
   * Vertex buffer
   * @type {Buffer[]}
   */
  public buffers: Buffer[] = [];


  public indices: { [geometryType: string]: IndexBufferInfo } = {};

  public accessors: { [semantics: string]: GeometryVertexBufferAccessor } = {};

  public aabb: AABB = new AABB([Vector3.Zero]);

  constructor(public gl: WebGLRenderingContext) {
  }

  public addAttributes(buffer: number[] | BufferSource, accessors: { [semantcis: string]: VertexBufferAccessor }, usage?: number): void;
  public addAttributes(buffer: number[] | BufferSource | Buffer, accessors: { [semantics: string]: VertexBufferAccessor }): void
  public addAttributes(buffer: Buffer | number[] | BufferSource, accessors: { [semantics: string]: VertexBufferAccessor }, usage: number = WebGLRenderingContext.STATIC_DRAW): void {
    buffer = this._ensureToBeVertexBuffer(buffer, usage);
    let index = this.buffers.length;
    this.buffers.push(buffer);
    for (let semantic in accessors) {
      const accessor = accessors[semantic] as GeometryVertexBufferAccessor;
      accessor.bufferIndex = index;
      if (accessor.size === void 0) {
        throw new Error(`Accessor specified with the semantics "${semantic}" is not containing size as paranmeter.`);
      }
      if (accessor.type === void 0) {
        accessor.type = WebGLRenderingContext.FLOAT;
      }
      if (accessor.stride === void 0) {
        accessor.stride = accessor.size * this._attribTypeToByteSize(accessor.type);
      }
      if (accessor.offset === void 0) {
        accessor.offset = 0;
      }
      if (accessor.normalized === void 0) {
        accessor.normalized = false;
      }
      this.accessors[semantic] = accessor;
    }
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
  public addIndex(indexName: string, buffer: Buffer | number[] | BufferSource, topology: number = WebGLRenderingContext.TRIANGLES, offset: number = 0, count: number = null, type: number = 0): void {
    if (!count) {
      if ((buffer instanceof Buffer || buffer instanceof ArrayBuffer || buffer instanceof DataView)) {
        throw new Error("The argument 'count' is necessary if you specified buffer with an instance of Buffer or ArrayBuffer");
      } else {
        count = buffer["length"];
      }
    }
    if (type === 0) {
      type = this._indexTypeFromCount(count);
    }
    buffer = this._ensureToBeIndexBuffer(buffer, type);
    this.indices[indexName] = {
      byteOffset: offset,
      byteSize: this._indexTypeToByteSize(type),
      type: type,
      topology: topology,
      count: count,
      index: buffer
    };
  }

  public drawByDefault(indexName: string, attribNames: string[], program: Program, count = Number.MAX_VALUE, offset = 0): void {
    attribNames.forEach(name => {
      Geometry.bindBufferToAttribute(this, program, name, name);
    });
    Geometry.drawWithCurrentVertexBuffer(this, indexName, count, offset);
  }
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
    return true;
  }

  public static drawWithCurrentVertexBuffer(geometry: Geometry, indexName: string, count: number = Number.MAX_VALUE, offset: number = 0): void {
    const targetIndex = geometry.indices[indexName];
    if (targetIndex === void 0) {
      throw new Error(`Specified index buffer "${indexName}" was not found on this geometry.All of the index buffer available on this geometry is "${Object.keys(geometry.indices)}"`);
    }
    targetIndex.index.bind();
    targetIndex.index.gl.drawElements(targetIndex.topology, Math.min(targetIndex.count, count), targetIndex.type, Math.min(offset * targetIndex.byteSize + targetIndex.byteOffset, targetIndex.byteOffset + (targetIndex.count - 1) * targetIndex.byteSize));

  }

  /**
   * Make sure buffer sources converted into Buffer
   * @param  {Buffer|BufferSource|number[]} buffer [description]
   * @return {Buffer}                              [description]
   */
  private _ensureToBeVertexBuffer(buffer: Buffer | BufferSource | number[], usage: number): Buffer {
    if (!(buffer instanceof Buffer)) {
      let bufferSource = buffer;
      if (Array.isArray(bufferSource)) {
        bufferSource = new Float32Array(bufferSource);
      }
      buffer = new Buffer(this.gl, WebGLRenderingContext.ARRAY_BUFFER, usage);
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
        bufferSource = new (this._indexTypeToArrayConstructor(type))(bufferSource);
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

  private _indexTypeFromCount(count: number): number {
    if (count < 256) {
      return WebGLRenderingContext.UNSIGNED_BYTE;
    } else if (count < 65536) {
      return WebGLRenderingContext.UNSIGNED_SHORT;
    } else if (count < 4294967296) {
      return WebGLRenderingContext.UNSIGNED_INT;
    } else {
      throw new Error("Index count exceeds 4,294,967,296. WebGL can not handle such a big index buffer");
    }
  }

  private _indexTypeToArrayConstructor(type: number): (new (arr: number[]) => ArrayBufferView) {
    switch (type) {
      case WebGLRenderingContext.UNSIGNED_BYTE:
        return Uint8Array;
      case WebGLRenderingContext.UNSIGNED_SHORT:
        return Uint16Array;
      case WebGLRenderingContext.UNSIGNED_INT:
        return Uint32Array;
      default:
        throw new Error("Unsupported index type");
    }
  }

  private _indexTypeToByteSize(type: number): number {
    switch (type) {
      case WebGLRenderingContext.UNSIGNED_BYTE:
        return 1;
      case WebGLRenderingContext.UNSIGNED_SHORT:
        return 2;
      case WebGLRenderingContext.UNSIGNED_INT:
        return 4;
      default:
        throw new Error("Unsupported index type");
    }
  }

  private _attribTypeToByteSize(type: number): number {
    switch (type) {
      case WebGLRenderingContext.FLOAT:
      case WebGLRenderingContext.UNSIGNED_INT:
        return 4;
      case WebGLRenderingContext.UNSIGNED_SHORT:
        return 2;
      case WebGLRenderingContext.UNSIGNED_BYTE:
        return 1;
      default:
        throw new Error(`Unsupported attribute variable type "${type}"`);
    }
  }
}
