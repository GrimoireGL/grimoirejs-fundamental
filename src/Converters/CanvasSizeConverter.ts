import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import CanvasSizeObject from "../Objects/CanvasSizeObject";

export default function CanvasSizeConverter(val: any): any {
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
