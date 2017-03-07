import CameraComponent from "../Components/CameraComponent";
import IRenderArgument from "./IRenderArgument";
interface IRenderable {
    index: number;
    renderArgs: { [key: string]: any };
    getRenderingPriorty(camera: CameraComponent, cameraUpdated: boolean, lastPriorty: number): number;
    render(renderArg: IRenderArgument): void;
    setRenderableIndex(index: number);
}
export default IRenderable;
