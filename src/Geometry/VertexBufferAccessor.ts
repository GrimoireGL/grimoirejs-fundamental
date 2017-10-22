import IBufferAccessor from "./BufferAccessor";

export default interface IVertexBufferAccessor extends IBufferAccessor {
  type?: number;
  keepOnBuffer?: boolean;
  normalized?: boolean;
  instancingDivisor?: number; // experimental
}
