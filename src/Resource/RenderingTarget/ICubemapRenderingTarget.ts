import IRenderingTarget from "./IRenderingTarget";
export default interface ICubemapRenderingTarget extends IRenderingTarget {
    beforeDraw(clearFlag: number, color: number[] | null, depth: number | null, direction?: string): void;
}
