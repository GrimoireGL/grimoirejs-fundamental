import CameraComponent from "../Components/CameraComponent";
import Material from "../Material/Material";
import Viewport from "../Resource/Viewport";
import Timer from "../Util/Timer";
// RendererComponent=>($renderRenderStage) => RenderStages
// RenderStages => (CameraComponent#renderScene) =>
interface IRendnerRendererMessage {
  timer: Timer;
}

export default IRendnerRendererMessage;
