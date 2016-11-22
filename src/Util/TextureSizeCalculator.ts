export default class TextureSizeCalculator {
  public static getPow2Size(width: number, height: number): { width: number, height: number } {
    const nw = Math.pow(2, Math.log(width) / Math.LN2 | 0); // largest 2^n integer that does not exceed s
    const nh = Math.pow(2, Math.log(height) / Math.LN2 | 0); // largest 2^n integer that does not exceed s
    return {
      width: nw,
      height: nh
    };
  }
}
