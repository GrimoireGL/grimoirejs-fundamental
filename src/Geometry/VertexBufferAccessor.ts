interface VertexBufferAccessor {
  size: number;
  offset?: number;
  stride?: number;
  type?: number;
  keepOnBuffer?: boolean;
  normalized?: boolean;
  instancingDivisor?: number; // experimental
}

export default VertexBufferAccessor;
