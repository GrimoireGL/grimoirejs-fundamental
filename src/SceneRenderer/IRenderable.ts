import CameraComponent from "../Components/CameraComponent";
import IRenderArgument from "./IRenderArgument";
interface IRenderable {
  id: string;
  getRenderingPriorty(camera: CameraComponent, cameraUpdated: boolean, lastPriorty: number): number;
  render(renderArg: IRenderArgument): void;
}
export default IRenderable;
