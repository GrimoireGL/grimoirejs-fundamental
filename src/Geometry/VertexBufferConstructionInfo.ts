interface VertexBufferConstructionInfo {
  verticies: {
    [bufferName: string]: {
      size: { [attributeName: string]: number }
      count: number;
      generator: () => Iterable<number>;
      type?: number;
      usage?: number;
    }
  };
  index: () => Iterable<number>;
}

export default VertexBufferConstructionInfo;
