import AABB from "grimoirejs-math/ref/AABB";
import VertexBufferAttribInfo from "./VertexBufferAttribInfo";
import Program from "../Resource/Program";
import IndexBufferInfo from "./IndexBufferInfo";
import Buffer from "../Resource/Buffer"
/**
 * The geometry class for managing buffer resource
 */
export default class Geometry {

  private static _lastGeometry: Map<WebGLRenderingContext, Geometry> = new Map<WebGLRenderingContext, Geometry>();

  public gl: WebGLRenderingContext;

  constructor(public vertices: { [key: string]: Buffer }, public attribInfo: { [key: string]: VertexBufferAttribInfo }, public indices: { [key: string]: IndexBufferInfo }, public aabb: AABB) {
    // check all buffers requested by attribute variables are all contained in vertices
    for (let attrKey in attribInfo) {
      if (vertices[attribInfo[attrKey].bufferName] === void 0) {
        throw new Error(`The buffer request by ${attribInfo[attrKey].bufferName} is not contained in geometry.`);
      }
    }
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
	 * @param  {string}   bufferName    [description]
	 * @return {boolean}                [description]
	 */
  public static bindBufferToAttribute(geometry: Geometry, program: Program, attributeName: string, bufferName: string): boolean {
    const index = program.findAttributeLocation(attributeName);
    if (index < 0) {
      return false;
    }
    const attribInfo = geometry.attribInfo[bufferName];
    if (!attribInfo) {
      throw new Error(`Specified buffer "${bufferName} was not found on this geometry while attempt to bind "${attributeName}" of attribute variables.\n
	  All of the vertex buffer available on this geometry is ${Object.keys(geometry.attribInfo)}"`);
    }
    const buffer = geometry.vertices[attribInfo.bufferName];
    buffer.bind();
    program.gl.vertexAttribPointer(index, attribInfo.size, attribInfo.type, false, attribInfo.stride, attribInfo.offset);
    return true;
  }

  public static drawWithCurrentVertexBuffer(geometry: Geometry, indexName: string, count: number = Number.MAX_VALUE, offset: number = 0): void {
    const targetIndex = geometry.indices[indexName];
    if (targetIndex === void 0) {
      throw new Error(`Specified index buffer "${indexName}" was not found on this geometry.All of the index buffer available on this geometry is "${Object.keys(geometry.indices)}"`);
    }
    targetIndex.index.bind();
    targetIndex.index.gl.drawElements(targetIndex.topology, Math.min(targetIndex.count, count), targetIndex.type, Math.min(offset * targetIndex.byteSize + targetIndex.byteOffset, (targetIndex.count - 1) * targetIndex.byteSize));

  }
}
