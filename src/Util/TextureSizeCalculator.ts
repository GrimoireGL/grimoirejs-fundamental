export default class TextureSizeCalculator {
  public static getPow2Size(width: number, height: number): { width: number, height: number } {
    const nw = Math.pow(2, Math.ceil(Math.log2(width))); // largest 2^n integer that does not exceed s
    const nh = Math.pow(2, Math.ceil(Math.log2(height))); // largest 2^n integer that does not exceed s
    return {
      width: nw,
      height: nh
    };
  }
}
