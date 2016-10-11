import {Vector3} from "grimoirejs-math";
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
      const sin = Math.sin(Math.PI * 2 - theta);
      const cos = Math.cos(Math.PI * 2 - theta);
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

  public static *trianglePosition(center: Vector3, up: Vector3, right: Vector3): IterableIterator<number> {
    let p0 = center.addWith(up);
    let p1 = center.subtractWith(up).addWith(right);
    let p2 = center.subtractWith(up).subtractWith(right);
    yield* p0.rawElements as number[];
    yield* p1.rawElements as number[];
    yield* p2.rawElements as number[];
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
  public static *planePosition(center: Vector3, up: Vector3, right: Vector3, divide): IterableIterator<number> {

    for (let i = 0; i < divide; i++) {
      for (let j = 0; j < divide; j++) {
        const vec = center.addWith(Vector3.multiply(divide / 4 - j * 2 / divide, up)).addWith(Vector3.multiply(divide / 4 - i * 2 / divide, right));
        yield* GeometryUtility.quadPosition(vec, Vector3.multiply(1 / divide, up), Vector3.multiply(1 / divide, right));
        yield* GeometryUtility.quadPosition(vec, Vector3.multiply(1 / divide, up), Vector3.multiply(1 / divide, right.negateThis()));
      }
    }


  }

  public static *cylinderPosition(center: Vector3, up: Vector3, right: Vector3, forward: Vector3, divide: number): IterableIterator<number> {
    yield* GeometryUtility.ellipsePosition(center.addWith(up), forward, right, divide);
    yield* GeometryUtility.ellipsePosition(center.subtractWith(up), forward, Vector3.negate(right), divide);
    const step = 2 * Math.PI / divide;
    const d = Math.cos(step / 2);
    const d2 = Math.sin(step / 2);
    for (let i = 0; i < divide; i++) {
      const theta = step / 2 + step * i;
      const sin = Math.sin((Math.PI - step) / 2 - theta);
      const cos = Math.cos((Math.PI - step) / 2 - theta);
      const currentCenter = new Vector3(d * cos, center.Y, d * sin);
      const currentRight = new Vector3(Math.cos(- step / 2 - theta), center.Y, Math.sin(- step / 2 - theta));
      yield* GeometryUtility.quadPosition(currentCenter, up, Vector3.multiply(d2, currentRight));
    }
  }
  public static *conePosition(center: Vector3, up: Vector3, right: Vector3, forward: Vector3, divide: number): IterableIterator<number> {
    yield* GeometryUtility.ellipsePosition(center.subtractWith(up), forward, Vector3.negate(right), divide);
    const step = 2 * Math.PI / divide;
    const d = Math.cos(step / 2) / 2;
    const d2 = Math.sin(step / 2);
    for (let i = 0; i < divide; i++) {
      const theta = step * i;
      const sin = Math.sin((Math.PI - step) / 2 - theta);
      const cos = Math.cos((Math.PI - step) / 2 - theta);
      const currentCenter = new Vector3(d * cos, center.Y, d * sin);
      const currentRight = new Vector3(Math.cos(- step / 2 - theta), center.Y, Math.sin(- step / 2 - theta));
      yield* GeometryUtility.trianglePosition(currentCenter, up.subtractWith(currentCenter), Vector3.multiply(d2, currentRight));
    }
  }
  public static *quadNormal(normal: Vector3): IterableIterator<number> {
    yield* normal.rawElements as number[];
    yield* normal.rawElements as number[];
    yield* normal.rawElements as number[];
    yield* normal.rawElements as number[];
  }
  public static *ellipseNormal(normal: Vector3, divide: number): IterableIterator<number> {
    for (let i = 0; i < divide + 1; i++) {
      yield* normal.rawElements as number[];
    }
  }
  public static *triangleNormal(normal: Vector3): IterableIterator<number> {
    yield* normal.rawElements as number[];
    yield* normal.rawElements as number[];
    yield* normal.rawElements as number[];
  }
  public static *cubeNormal(center: Vector3, up: Vector3, right: Vector3, forward: Vector3): IterableIterator<number> {
    yield* GeometryUtility.quadNormal(forward.negateThis());
    yield* GeometryUtility.quadNormal(forward);
    yield* GeometryUtility.quadNormal(up);
    yield* GeometryUtility.quadNormal(right);
    yield* GeometryUtility.quadNormal(up.negateThis());
    yield* GeometryUtility.quadNormal(right.negateThis());
  }
  public static *cylinderNormal(center: Vector3, up: Vector3, right: Vector3, forward: Vector3, divide: number): IterableIterator<number> {
    yield* GeometryUtility.ellipseNormal(up, divide);
    yield* GeometryUtility.ellipseNormal(up.negateThis(), divide);
    const step = 2 * Math.PI / divide;
    for (let i = 0; i < divide; i++) {
      const theta = step / 2 + step * i;
      const sin = Math.sin((Math.PI - step) / 2 - theta);
      const cos = Math.cos((Math.PI - step) / 2 - theta);
      const currentRight = new Vector3(Math.cos(- step / 2 - theta), center.Y, Math.sin(- step / 2 - theta));
      yield* GeometryUtility.quadNormal(Vector3.cross(up, currentRight));
    }
  }
  public static *coneNormal(center: Vector3, up: Vector3, right: Vector3, forward: Vector3, divide: number): IterableIterator<number> {
    yield* GeometryUtility.ellipseNormal(up.negateThis(), divide);
    const step = 2 * Math.PI / divide;
    const d = Math.cos(step / 2) / 2;
    for (let i = 0; i < divide; i++) {
      const theta = step * i;
      const sin = Math.sin((Math.PI - step) / 2 - theta);
      const cos = Math.cos((Math.PI - step) / 2 - theta);
      const currentCenter = new Vector3(d * cos, center.Y, d * sin);
      const currentRight = new Vector3(Math.cos(- step / 2 - theta), center.Y, Math.sin(- step / 2 - theta));
      yield* GeometryUtility.triangleNormal(Vector3.cross(up.subtractWith(currentCenter), currentRight));
    }
  }
  public static *planeNormal(normal: Vector3, divide: number): IterableIterator<number> {
    for (let i = 0; i < divide; i++) {
      for (let j = 0; j < divide; j++) {
        yield* GeometryUtility.quadNormal(normal);
        yield* GeometryUtility.quadNormal(normal.negateThis());
      }
    }
  }


  public static *spherePosition(center: Vector3, up: Vector3, right: Vector3, forward: Vector3, rowDiv: number, circleDiv: number): IterableIterator<number> {
    yield* center.addWith(up).rawElements as number[];
    yield* center.subtractWith(up).rawElements as number[];
    const ia = 2 * Math.PI / circleDiv;
    const ja = Math.PI / (rowDiv + 1);
    for (let j = 1; j <= rowDiv; j++) {
      const phi = ja * j;
      const sinPhi = Math.sin(phi);
      const upVector = up.multiplyWith(Math.cos(phi));
      for (let i = 0; i <= circleDiv; i++) {
        const theta = ia * i;
        yield* (right.multiplyWith(Math.cos(theta)).addWith(forward.multiplyWith(Math.sin(theta)))).multiplyWith(sinPhi).addWith(upVector).rawElements as number[];
      }
    }
  }

  public static *sphereUV(rowDiv: number, circleDiv: number): IterableIterator<number> {
    yield* [0, 0, 0, 1];
    const ia = 2 * Math.PI / circleDiv;
    const ja = Math.PI / (rowDiv + 1);
    for (let j = 1; j <= rowDiv; j++) {
      const phi = ja * j;
      const sinPhi = Math.sin(phi);
      for (let i = 0; i <= circleDiv; i++) {
        const theta = ia * i;
        yield* [theta / Math.PI / 2, phi / Math.PI];
      }
    }
  }

  public static *sphereNormal(up: Vector3, right: Vector3, forward: Vector3, rowDiv: number, circleDiv: number): IterableIterator<number> {
    yield* GeometryUtility.spherePosition(Vector3.Zero, up, right, forward, rowDiv, circleDiv);
  }

  public static *triangleIndex(offset: number): IterableIterator<number> {
    const o = offset;
    yield* [o, o + 2, o + 1];
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

  public static *sphereIndex(offset: number, rowDiv: number, circleDiv: number): IterableIterator<number> {
    const getIndex = (i: number, j: number) => offset + (circleDiv + 1) * j + 2 + i;
    const top = offset;
    const bottom = offset + 1;
    // upper side
    for (let i = 0; i < circleDiv; i++) {
      yield top;
      yield getIndex(i, 0);
      yield getIndex(i + 1, 0);
    }
    // middle
    for (let j = 0; j < rowDiv - 1; j++) {
      for (let i = 0; i < circleDiv; i++) {
        yield getIndex(i, j);
        yield getIndex(i, j + 1);
        yield getIndex(i + 1, j);
        yield getIndex(i, j + 1);
        yield getIndex(i + 1, j + 1);
        yield getIndex(i + 1, j);
      }
    }
    // lower side
    for (let i = 0; i < circleDiv; i++) {
      yield bottom;
      yield getIndex(i + 1, rowDiv - 1);
      yield getIndex(i, rowDiv - 1);
    }
  }

  public static *cylinderIndex(offset: number, divide: number): IterableIterator<number> {
    const s = GeometryUtility.ellipseSize(divide);
    const t = GeometryUtility.quadSize();
    yield* GeometryUtility.ellipseIndex(offset, divide);
    yield* GeometryUtility.ellipseIndex(offset + s, divide);
    for (let i = 0; i < divide; i++) {
      yield* GeometryUtility.quadIndex(offset + s * 2 + t * i);
    }
  }
  public static *coneIndex(offset: number, divide: number): IterableIterator<number> {
    const s = GeometryUtility.ellipseSize(divide);
    const t = GeometryUtility.triangleSize();
    yield* GeometryUtility.ellipseIndex(offset, divide);
    for (let i = 0; i < divide; i++) {
      yield* GeometryUtility.triangleIndex(offset + s + t * i);
    }
  }
  public static *planeIndex(offset: number, divide: number): IterableIterator<number> {
    const s = GeometryUtility.quadSize();
    for (let i = 0; i < 2 * divide * divide; i++) {
      yield* GeometryUtility.quadIndex(offset + s * i);
    }
  }

  public static quadSize(): number {
    return 4;
  }

  public static triangleSize(): number {
    return 3;
  }

  public static cubeSize(): number {
    return 6 * GeometryUtility.quadSize();
  }

  public static sphereSize(rowDiv: number, circleDiv: number): number {
    return 2 + rowDiv * (circleDiv + 1);
  }
  public static cylinderSize(divide: number): number {
    return (GeometryUtility.ellipseSize(divide) * 2) + divide * GeometryUtility.quadSize();
  }
  public static coneSize(divide: number): number {
    return GeometryUtility.ellipseSize(divide) + divide * GeometryUtility.triangleSize();
  }
  public static planeSize(divide: number): number {
    return 2 * divide * divide * GeometryUtility.quadSize();
  }
}
