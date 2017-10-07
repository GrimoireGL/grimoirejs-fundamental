import CameraComponent from "../Components/CameraComponent";
import Material from "../Material/Material";
import Viewport from "../Resource/Viewport";
import Timer from "../Util/Timer";
interface IRendnerRendererMessage {
  camera: CameraComponent;
  viewport: Viewport;
  material?: Material;
  materialArgs?: { [key: string]: Material; };
  timer: Timer;
}

export default IRendnerRendererMessage;
