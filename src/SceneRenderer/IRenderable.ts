import CameraComponent from "../Components/CameraComponent";
import IRenderArgument from "./IRenderArgument";
interface IRenderable {
  index: number;
  renderArgs: { [key: string]: any };
  getRenderingPriorty (camera: CameraComponent, technique: string): number;
  render (renderArg: IRenderArgument): void;
  setRenderableIndex (index: number);
}
export default IRenderable;
