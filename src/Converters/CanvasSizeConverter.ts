import Attribute from "grimoirejs/lib/Node/Attribute";
import CanvasSizeObject from "../Objects/CanvasSizeObject";

function CanvasSizeConverter(this: Attribute, val: any): any {
  if (val === "fit") {
    return {
      mode: "fit",
    } as CanvasSizeObject;
  }
  if (typeof val === "string") {
    const matched = /aspect\(([\d+(?.\d*)?]+)\)/.exec(val);
    if (matched) {
      return {
        mode: "aspect",
        aspect: Number.parseFloat(matched[1])
      };
    }
  }
  return {
    mode: "manual",
    size: Number.parseFloat(val)
  } as CanvasSizeObject;
}

export default CanvasSizeConverter;
