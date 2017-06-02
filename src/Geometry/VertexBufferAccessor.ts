interface VertexBufferAccessor {
  size: number;
  offset?: number;
  stride?: number;
  type?: number;
  normalized?: boolean;
}

export default VertexBufferAccessor;
