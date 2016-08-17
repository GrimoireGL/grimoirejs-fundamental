import Program from "../Resource/Program";
import IndexBufferInfo from "./IndexBufferInfo";
import Buffer from "../Resource/Buffer";
import IDObject from "grimoirejs/lib/Core/Base/IDObject";
import VertexBufferAttribInfo from "./VertexBufferAttribInfo";

/**
 * The geometry class for managing buffer resource
 */
export default class Geometry {

  private _gl: WebGLRenderingContext;

  constructor(public vertexBuffers: { [key: string]: Buffer }, public attribInfo: { [key: string]: VertexBufferAttribInfo }, public index: IndexBufferInfo) {
    // check all buffer actually created with same context
    const gl: WebGLRenderingContext = index.index.gl;
    for (let vertKey in vertexBuffers) {
      if (gl !== vertexBuffers[vertKey].gl) {
        throw new Error("All buffer must be created with same gl context");
      }
    }
    this._gl = gl;
    // check all buffers requested by attribute variables are all contained in vertexBuffers
    for (let attrKey in attribInfo) {
      if (typeof vertexBuffers[attribInfo[attrKey].bufferName] === "undefined") {
        throw new Error(`The buffer request by ${attribInfo[attrKey].bufferName} is not contained in geometry.`);
      }
    }
  }

  public draw(attribNames: string[], program: Program) {
    attribNames.forEach(name => {
      const attribInfo = this.attribInfo[name];
      if (!attribInfo) {
        throw new Error("There is no such vertex buffer");
      }
      const index = program.findAttributeLocation(name);
      if (index < 0) {
        return;
      }
      const buffer = this.vertexBuffers[attribInfo.bufferName];
      this._gl.vertexAttribPointer(index, attribInfo.size, attribInfo.type, false, attribInfo.stride, attribInfo.offset);
    });
    this.index.index.bind();
    this._gl.useProgram(program.program);
    this._gl.drawElements(this.index.topology, this.index.count, this.index.type, this.index.offset);
  }
}
