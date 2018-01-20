import BufferAccessor from "./BufferAccessor";

interface VertexBufferAccessor extends BufferAccessor {
  type: number;
  normalized: boolean;
}

export default VertexBufferAccessor;
