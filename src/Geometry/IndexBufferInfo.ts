import Buffer from "../Resource/Buffer";

interface IndexBufferInfo {
  index?: Buffer;
  topology: number;
  byteOffset: number;
  type: number;
  count: number;
  byteSize: number;
  // instanceCount?: number; // experimental
}

export default IndexBufferInfo;
