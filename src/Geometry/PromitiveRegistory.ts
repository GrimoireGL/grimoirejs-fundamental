import Vector3 from "grimoirejs/lib/Core/Math/Vector3";
export default class GeometryUtility {
  /**
   * Generateor wrap for array
   * @param  {number[]}                 array [description]
   * @return {IterableIterator<number>}       [description]
   */
  public static *fromArray(array: number[]): IterableIterator<number> {
    for (let i = 0; i < array.length; i++) {
      yield array[i];
    }
  }
  /**
   * Convert triangles topology to lines. Basically uses for making wireframes.
   * @param  {IterableIterator<number>} indicies [description]
   * @return {IterableIterator<number>}          [description]
   */
  public static *linesFromTriangles(indicies: IterableIterator<number>): IterableIterator<number> {
    const ic: number[] = new Array(3);
    let i = 0;
    for (let index of indicies) {
      ic[i % 3] = index;
      if (i % 3 === 2) {
        const a = ic[0], b = ic[1], c = ic[2];
        yield* [a, b, b, c, c, a] as number[];
      }
      i++;
    }
  }

  public static *ellipsePosition(center: Vector3, up: Vector3, right: Vector3, divide: number): IterableIterator<number> {
    yield center.X; yield center.Y; yield center.Z;
    const step = 2 * Math.PI / divide;
    for (let i = 0; i < divide; i++) {
      const theta = step * i;
      const sin = Math.sin(theta);
      const cos = Math.cos(theta);
      yield center.X + cos * up.X + sin * right.X;
      yield center.Y + cos * up.Y + sin * right.Y;
      yield center.Z + cos * up.Z + sin * right.Z;
    }
  }

  public static *ellipseIndex(offset: number, divide: number): IterableIterator<number> {
    for (let i = 0; i < divide - 1; i++) {
      yield* [offset, offset + 1 + i, offset + 2 + i];
    }
    yield* [offset, offset + divide, offset + 1];
  }

  public static ellipseSize(divide: number): number {
    return divide + 1;
  }
}
