import AABB from "grimoirejs-math/ref/AABB";
import VertexBufferAttribInfo from "./VertexBufferAttribInfo";
import Program from "../Resource/Program";
import IndexBufferInfo from "./IndexBufferInfo";
import Buffer from "../Resource/Buffer"
/**
 * The geometry class for managing buffer resource
 */
export default class Geometry {

  private _gl: WebGLRenderingContext;

  constructor(public verticies: { [key: string]: Buffer }, public attribInfo: { [key: string]: VertexBufferAttribInfo }, public indicies: { [key: string]: IndexBufferInfo }, public aabb: AABB) {
    this._validateGLContext();
    // check all buffers requested by attribute variables are all contained in verticies
    for (let attrKey in attribInfo) {
      if (typeof verticies[attribInfo[attrKey].bufferName] === "undefined") {
        throw new Error(`The buffer request by ${attribInfo[attrKey].bufferName} is not contained in geometry.`);
      }
    }
  }

  public draw(indexName: string, attribNames: string[], program: Program, count = Number.MAX_VALUE, offset = 0): void {
    const targetIndex = this.indicies[indexName];
    attribNames.forEach(name => {
      const index = program.findAttributeLocation(name);
      if (index < 0) {
        return;
      }
      const attribInfo = this.attribInfo[name];
      if (!attribInfo) {
        throw new Error("There is no such vertex buffer");
      }
      const buffer = this.verticies[attribInfo.bufferName];
      buffer.bind();
      this._gl.vertexAttribPointer(index, attribInfo.size, attribInfo.type, false, attribInfo.stride, attribInfo.offset);
    });
    targetIndex.index.bind();
    this._gl.drawElements(targetIndex.topology, Math.min(targetIndex.count, count), targetIndex.type, Math.min(offset * targetIndex.byteSize + targetIndex.byteOffset, (targetIndex.count - 1) * targetIndex.byteSize));
  }

  private _validateGLContext(): void {
    // Check for index buffers
    for (let indexName in this.indicies) {
      const index = this.indicies[indexName];
      if (!this._gl) {
        this._gl = index.index.gl;
      }
      if (this._gl !== index.index.gl) {
        throw new Error("All index buffers should be initialized with same context");
      }
    }
    // Check for vertex buffers
    for (let vertexName in this.verticies) {
      const vertex = this.verticies[vertexName];
      if (this._gl !== vertex.gl) {
        throw new Error("All vertex buffers should be initialized with same context");
      }
    }
  }
}
