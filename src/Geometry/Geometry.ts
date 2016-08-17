import IndexBufferInfo from "./IndexBufferInfo";
import Buffer from "../Resource/Buffer";
import IDObject from "grimoirejs/lib/Core/Base/IDObject";
import VertexBufferConstructionInfo from "./VertexBufferConstructionInfo";
import VertexBufferAttribInfo from "./VertexBufferAttribInfo";

/**
 * The geometry class for managing buffer resource
 */
export default class Geometry {

  constructor(public vertexBuffers: { [key: string]: Buffer }, public attribInfo: { [key: string]: VertexBufferAttribInfo }, public index: IndexBufferInfo) {

  }
}
