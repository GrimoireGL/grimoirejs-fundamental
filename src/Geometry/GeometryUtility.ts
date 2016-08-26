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
  /**
   * Generator for ellipse positions
   * @param  {Vector3}                  center [the center position of ellipse]
   * @param  {Vector3}                  up     [up vector for ellipse]
   * @param  {Vector3}                  right  [right vector for ellipse]
   * @param  {number}                   divide [how many triangles should consists in the ellipse]
   * @return {IterableIterator<number>}        [Generated iterator for position]
   */
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

  public static *cubePosition(center: Vector3, up: Vector3, right: Vector3, forward: Vector3): IterableIterator<number> {
    yield* GeometryUtility.quadPosition(center.subtractWith(forward), up, right); // 手前
    yield* GeometryUtility.quadPosition(center.addWith(forward), up, right.negateThis()); // 奥
    yield* GeometryUtility.quadPosition(center.addWith(up), forward, right); // 上
    yield* GeometryUtility.quadPosition(center.addWith(right), forward, up.negateThis()); // 右
    yield* GeometryUtility.quadPosition(center.subtractWith(up), forward, right.negateThis()); // 下
    yield* GeometryUtility.quadPosition(center.subtractWith(right), forward, up); // 左
  }

  public static *quadPosition(center: Vector3, up: Vector3, right: Vector3): IterableIterator<number> {
    let p0 = center.subtractWith(right).addWith(up);
    let p1 = center.addWith(right).addWith(up);
    let p2 = center.addWith(right).subtractWith(up);
    let p3 = center.subtractWith(right).subtractWith(up);
    yield* p0.rawElements as number[];
    yield* p1.rawElements as number[];
    yield* p2.rawElements as number[];
    yield* p3.rawElements as number[];
  }

  public static *quadIndex(offset: number): IterableIterator<number> {
    const o = offset;
    yield* [o, o + 2, o + 1, o, o + 3, o + 2];
  }

  public static *cubeIndex(offset: number): IterableIterator<number> {
    const s = GeometryUtility.quadSize();
    for (let i = 0; i < 6; i++) {
      yield* GeometryUtility.quadIndex(offset + s * i);
    }
  }

  public static quadSize(): number {
    return 4;
  }

  public static cubeSize(): number {
    return 6 * GeometryUtility.quadSize();
  }
}
