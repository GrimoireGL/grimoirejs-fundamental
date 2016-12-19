import Vector3 from "grimoirejs-math/ref/Vector3";
import AABB from "grimoirejs-math/ref/AABB";
import IndexBufferInfo from "./IndexBufferInfo";
import Buffer from "../Resource/Buffer";
import Geometry from "./Geometry";
import GeometryBufferConstructionInfo from "./GeometryBufferConstructionInfo";
import VertexBufferAttribInfo from "./VertexBufferAttribInfo";

/**
 * Helper class to instanciate Geometry easily.
 */
export default class GeometryBuilder {
  public static build(gl: WebGLRenderingContext, info: GeometryBufferConstructionInfo): Geometry {
    if (info["verticies"] | info["indicies"]) {
      throw new Error("Misspelled API was fixed already. use vertices and indices");
    }
    const buffers: { [key: string]: Buffer } = {};
    const attribs: { [key: string]: VertexBufferAttribInfo } = {};
    let aabb: AABB = info.aabb;
    const needConstructAABB: boolean = !aabb;
    if (needConstructAABB) {
      aabb = new AABB();
    }
    for (let bufferKey in info.vertices) {
      const byteWidth = 4;
      const buffer = info.vertices[bufferKey];
      let sizeSum = 0;
      for (let attribKey in buffer.size) {
        if (attribs[attribKey]) {
          throw new Error("Attribute variable name was dupelicated");
        }
        const size = buffer.size[attribKey];
        attribs[attribKey] = {
          size: size,
          offset: sizeSum * byteWidth,
          bufferName: bufferKey,
          type: buffer.type ? buffer.type : WebGLRenderingContext.FLOAT,
          stride: 0
        };
        sizeSum += size;
      }
      for (let attribKey in buffer.size) {
        attribs[attribKey].stride = sizeSum * byteWidth;
      }
      // generate source array of vertex buffer
      const bufferSource = new Array(sizeSum * buffer.count);
      const bufferGenerator = buffer.getGenerators();
      const generators: Iterator<number>[] = [];
      let positionGeneratorIndex: number = 0;
      const sizes: number[] = [];
      const beforeEach = bufferGenerator.beforeEach ? bufferGenerator.beforeEach() : undefined;
      for (let attribKey in buffer.size) { // instanciate iterables
        if (attribKey === "beforeEach") {
          continue;
        }
        const generator = bufferGenerator[attribKey] as () => IterableIterator<number>;
        generators.push(generator());
        sizes.push(buffer.size[attribKey]);
        if (attribKey === "position") {
          positionGeneratorIndex = generators.length - 1;
        }
      }
      let i = 0;
      for (let vertCount = 0; vertCount < buffer.count; vertCount++) {
        if (beforeEach && beforeEach.next().done) {
          throw new Error("before each was ended before reaching count.");
        }
        for (let genIndex = 0; genIndex < generators.length; genIndex++) {
          const generator = generators[genIndex];
          for (let sizeIndex = 0; sizeIndex < sizes[genIndex]; sizeIndex++) {
            const genResult = generator.next();
            if (genResult.done) {
              throw new Error("Generator function finished before reaching specified count");
            }
            bufferSource[i] = genResult.value;
            i++;
          }
          if (needConstructAABB && genIndex === positionGeneratorIndex) {
            aabb.expand(new Vector3(bufferSource[i - 3], bufferSource[i - 2], bufferSource[i - 1]))
          }
        }
      }
      // instanciate buffers
      buffers[bufferKey] = new Buffer(gl, WebGLRenderingContext.ARRAY_BUFFER, buffer.usage ? buffer.usage : WebGLRenderingContext.STATIC_DRAW);
      buffers[bufferKey].update(new Float32Array(bufferSource));
    }
    return new Geometry(buffers, attribs, this._generateIndices(gl, info.indices), aabb);
  }

  private static _generateIndices(gl: WebGLRenderingContext, indexGenerator: { [indexName: string]: { generator: () => IterableIterator<number>, topology: number } }): { [indexName: string]: IndexBufferInfo } {
    const indexMap: { [indexName: string]: IndexBufferInfo } = {};
    for (let indexName in indexGenerator) {
      const indices: number[] = [];
      const generatorInfo = indexGenerator[indexName];
      for (let variable of generatorInfo.generator()) {
        indices.push(variable);
      }
      const bufferType = this._getIndexType(indices.length);
      const buffer = new Buffer(gl, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW);
      buffer.update(new bufferType.ctor(indices));
      indexMap[indexName] = {
        count: indices.length,
        index: buffer,
        type: bufferType.format,
        byteSize: bufferType.byteSize,
        byteOffset: 0,
        topology: generatorInfo.topology ? generatorInfo.topology : WebGLRenderingContext.TRIANGLES
      };
    }
    return indexMap;
  }

  /**
   * Determine which index type should be used
   * @param  {number} length [description]
   * @return {[type]}        [description]
   */
  private static _getIndexType(length: number): {
    format: number,
    ctor: new (input: number[]) => ArrayBufferView,
    byteSize: number
  } {
    let format: number = WebGLRenderingContext.UNSIGNED_INT;
    let arrayConstructor: new (arr: number[]) => ArrayBufferView = Uint32Array;
    let byteSize: number = 4;
    if (length < 256) {
      format = WebGLRenderingContext.UNSIGNED_BYTE;
      arrayConstructor = Uint8Array;
      byteSize = 1;
    } else if (length < 65535) {
      format = WebGLRenderingContext.UNSIGNED_SHORT;
      arrayConstructor = Uint16Array;
      byteSize = 2;
    } else if (length >= 4294967296) {
      throw new Error("Too many index of geometry!");
    }
    return {
      format: format,
      ctor: arrayConstructor,
      byteSize: byteSize
    };
  }
}
