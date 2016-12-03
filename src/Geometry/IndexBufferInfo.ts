import Buffer from "../Resource/Buffer";

interface IndexBufferInfo {
  index: Buffer;
  count: number;
  type: number;
  topology: number;
  byteOffset: number;
  byteSize: number;
}

export default IndexBufferInfo;
