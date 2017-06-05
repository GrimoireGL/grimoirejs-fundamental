import Rectangle from "grimoirejs-math/ref/Rectangle";

function _toPixel(parentSize: number, rep: string): number {
  let regex = /(\d+)\s*%/;
  let regexResult: RegExpExecArray |null;
  if ((regexResult = regex.exec(rep))) {
    const percentage = Number.parseFloat(regexResult[1]);
    return Math.floor(parentSize * percentage * 0.01);
  } else {
    return Math.floor(Number.parseFloat(rep));
  }
}
/**
 * ビューポートサイズを設定するためのコンバーター
 * `auto`・・・親のキャンバスのサイズにあったビューポートサイズを返す
 * `左端,上端,幅,高さ`・・・キャンバスのサイズを具体的に指定する。
 * 数値を指定するとピクセル単位になるが、数値に%をつければ親のキャンバス基準での比率指定ができる。
 */
export default function ViewportConverter(val: any): any {
  if (val instanceof Rectangle) {
    return () => val;
  }
  if (typeof val === "string") {
    if (val === "auto") {
      return (canvas: HTMLCanvasElement) => new Rectangle(0, 0, canvas.width, canvas.height);
    } else {
      const sizes = val.split(",");
      if (sizes.length !== 4) {
        throw new Error("Invalid viewport size was specified.");
      } else {
        return (canvas: HTMLCanvasElement) => new Rectangle(_toPixel(canvas.width, sizes[0]), _toPixel(canvas.height, sizes[1]), _toPixel(canvas.width, sizes[2]), _toPixel(canvas.height, sizes[3]));
      }
    }
  }
  throw new Error(`${val} could not be parsed`);
}
