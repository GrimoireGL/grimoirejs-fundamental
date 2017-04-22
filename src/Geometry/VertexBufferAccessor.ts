interface VertexBufferAccessor {
  size: number;
  offset?: number;
  stride?: number;
  type?: number;
  instancingDivisor?: number; // experimental
}

export default VertexBufferAccessor;
