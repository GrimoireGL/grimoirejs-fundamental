import IndexBufferInfo from "./IndexBufferInfo";
import Buffer from "../Resource/Buffer";
import Geometry from "./Geometry";
import VertexBufferConstructionInfo from "./VertexBufferConstructionInfo";
import VertexBufferAttribInfo from "./VertexBufferAttribInfo";


export default class GeometryBuilder {
  public static build(gl: WebGLRenderingContext, info: VertexBufferConstructionInfo): Geometry {
    const buffers: { [key: string]: Buffer } = {};
    const attribs: { [key: string]: VertexBufferAttribInfo } = {};
    for (let bufferKey in info.verticies) {
      const byteWidth = 4;
      const buffer = info.verticies[bufferKey];
      let sizeSum = 0;
      for (let attribKey in buffer.size) {
        if (attribs[attribKey]) {
          throw new Error("Attribute variable name was dupelicated");
        }
        const size = buffer.size[attribKey];
        attribs[attribKey] = {
          size: size * byteWidth,
          offset: sizeSum * byteWidth,
          bufferName: bufferKey,
          type: buffer.type ? buffer.type : WebGLRenderingContext.FLOAT,
          stride: 0
        };
        sizeSum += size;
      }
      for (let attribKey in buffer.size) {
        attribs[attribKey].stride = sizeSum * byteWidth - attribs[attribKey].size;
      }
      // generate vertex buffer
      const bufferSource = new Array(sizeSum * buffer.count);
      let i = 0;
      for (let elem of buffer.generator()) {
        bufferSource[i] = elem;
        i++;
      }
      buffers[bufferKey] = new Buffer(gl, WebGLRenderingContext.ARRAY_BUFFER, buffer.usage ? buffer.usage : WebGLRenderingContext.STATIC_DRAW);
      buffers[bufferKey].update(new Float32Array(bufferSource));
    }
    return new Geometry(buffers, attribs, this._getIndexInfo(gl, info.index));
  }

  private static _getIndexInfo(gl: WebGLRenderingContext, indexGenerator: () => Iterable<number>): IndexBufferInfo {
    const indicies: number[] = [];
    for (let variable of indexGenerator()) {
      indicies.push(variable);
    }
    const bufferType = this._getIndexType(indicies.length);
    const buffer = new Buffer(gl, WebGLRenderingContext.ELEMENT_ARRAY_BUFFER, WebGLRenderingContext.STATIC_DRAW);
    buffer.update(new bufferType.ctor(indicies));
    return {
      count: indicies.length,
      index: buffer,
      type: bufferType.format
    };
  }

  /**
   * Determine which index type should be used
   * @param  {number} length [description]
   * @return {[type]}        [description]
   */
  private static _getIndexType(length: number): {
    format: number,
    ctor: new (input: number[]) => ArrayBufferView
  } {
    let format: number = WebGLRenderingContext.UNSIGNED_INT;
    let arrayConstructor: new (arr: number[]) => ArrayBufferView = Uint32Array;
    if (length < 256) {
      format = WebGLRenderingContext.UNSIGNED_BYTE;
      arrayConstructor = Uint8Array;
    } else if (length < 65535) {
      format = WebGLRenderingContext.UNSIGNED_SHORT;
      arrayConstructor = Uint16Array;
    } else if (length >= 4294967296) {
      throw new Error("Too many index of geometry!");
    }
    return {
      format: format,
      ctor: arrayConstructor
    };
  }
}
