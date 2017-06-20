import gr from "grimoirejs";
import Viewport from "../Resource/Viewport";
import Rectangle from "grimoirejs-math/ref/Rectangle";
import Attribute from "grimoirejs/ref/Node/Attribute";
function _toPixel(parentSize: number, rep: string): number {
  let regex = /(\d+)\s*%/;
  let regexResult: RegExpExecArray;
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
    const vp = new Viewport(val.Left,val.Bottom,val.Width,val.Height);
    return () => vp;
  }else if(val instanceof Viewport){
    return ()=>val;
  }else if (typeof val === "string") {
    if (val === "auto") {
      return (canvas: HTMLCanvasElement) => new Viewport(0, 0, canvas.width, canvas.height);
    } else {
      const sizes = val.split(",");
      if (sizes.length !== 4) {
        throw new Error("Invalid viewport size was specified.");
      } else {
        return (canvas: HTMLCanvasElement) => new Viewport(_toPixel(canvas.width, sizes[0]), _toPixel(canvas.height, sizes[1]), _toPixel(canvas.width, sizes[2]), _toPixel(canvas.height, sizes[3]));
      }
    }
  }
  throw new Error(`${val} could not be parsed`);
}
