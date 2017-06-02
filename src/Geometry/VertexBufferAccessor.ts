interface VertexBufferAccessor {
  size: number;
  offset?: number;
  stride?: number;
  type?: number;
  normalized?: boolean;
  instancingDivisor?: number; // experimental
}

export default VertexBufferAccessor;
