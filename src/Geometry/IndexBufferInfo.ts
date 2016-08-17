import Buffer from "../Resource/Buffer";

interface IndexBufferInfo {
  index: Buffer;
  count: number;
  type: number;
  topology: number;
  offset: number;
}

export default IndexBufferInfo;
