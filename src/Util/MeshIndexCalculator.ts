import Vector4 from "grimoirejs-math/ref/Vector4";
export default class MeshIndexCalculator {

  private static _rc = 511;

  private static _gc = MeshIndexCalculator._rc << 8;

  private static _bc = MeshIndexCalculator._gc << 8;

  private static _ac = MeshIndexCalculator._bc << 8;

  public static fromIndex(index: number): Vector4 {
    return new Vector4((index & MeshIndexCalculator._rc) / 255, ((index & MeshIndexCalculator._gc) >> 8) / 255, ((index & MeshIndexCalculator._bc) >> 16) / 255, ((index & MeshIndexCalculator._ac) >> 24) / 255);
  }

  public static fromColor(color: Uint8Array): number {
    return color[0] + (color[1] << 8) + (color[2] << 16) + (color[3] << 24);
  }
}
