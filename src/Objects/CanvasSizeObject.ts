export type ResizeMode = CanvasSizeObject["mode"];
export type CanvasSizeObject = CanvasAspectObject | CanvasManualObject | CanvasFitObject;

export type CanvasAspectObject = {
  mode: "aspect",
  aspect: number,
}
export type CanvasManualObject = {
  mode: "manual",
  size: number,
}
export type CanvasFitObject = {
  mode: "fit",
}

export default CanvasSizeObject;
