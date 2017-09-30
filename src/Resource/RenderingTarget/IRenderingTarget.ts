import Viewport from "../Viewport";

export default interface IRenderingTarget {
    beforeDraw(clearFlag: number, color: number[] | null, depth: number | null): void;
    getBufferWidth():number;
    getBufferHeight():number;
    getViewport():Viewport;
}
