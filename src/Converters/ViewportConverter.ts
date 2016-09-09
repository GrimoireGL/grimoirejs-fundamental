import {Rectangle} from "grimoirejs-math";
import Attribute from "grimoirejs/lib/Node/Attribute";
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

function ViewportConverter(this: Attribute, val: any): any {
  if (val instanceof Rectangle) {
    return val;
  }
  if (typeof val === "string") {
    const canvas = this.companion.get("canvasElement") as HTMLCanvasElement;
    if (val === "auto") {
      return new Rectangle(0, 0, canvas.width, canvas.height);
    } else {
      const sizes = val.split(",");
      if (sizes.length !== 4) {
        throw new Error("Invalid viewport size was specified.");
      } else {
        return new Rectangle(_toPixel(canvas.width, sizes[0]), _toPixel(canvas.height, sizes[1]), _toPixel(canvas.width, sizes[2]), _toPixel(canvas.height, sizes[3]));
      }
    }
  }
  throw new Error(`${val} could not be parsed`);
}

export default ViewportConverter;