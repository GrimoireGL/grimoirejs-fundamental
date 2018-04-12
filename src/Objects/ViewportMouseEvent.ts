export default interface ViewportMouseEvent extends MouseEvent {
  viewportX: number;
  viewportY: number;
  viewportNormalizedX: number;
  viewportNormalizedY: number;
  canvasX: number;
  canvasY: number;
  canvasNormalizedX: number;
  canvasNormalizedY: number;
  inside: boolean;
}
