import AABB from "grimoirejs-math/ref/AABB";
interface GeometryBufferConstructionInfo {
  verticies: {
    [bufferName: string]: {
      size: { [attributeName: string]: number }
      count: number;
      getGenerators: () => {
        beforeEach?: () => IterableIterator<void>;
        [attributeName: string]: (() => IterableIterator<number>) | (() => IterableIterator<void>);
      };
      type?: number;
      usage?: number;
    }
  };
  indicies: {
    [indexName: string]: {
      generator: () => IterableIterator<number>;
      topology: number;
    };
  };
  aabb?: AABB;
}

export default GeometryBufferConstructionInfo;
