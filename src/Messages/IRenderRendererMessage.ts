import Material from "../Material/Material";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
import Rectangle from "grimoirejs-math/ref/Rectangle";
import Timer from "../Util/Timer";

interface IRendnerRendererMessage {
  camera: CameraComponent;
  viewport: Rectangle;
  buffers: { [key: string]: Texture2D };
  bufferSizes: { [bufferName: string]: { width: number, height: number } };
  material?: Material;
  materialArgs?: { [key: string]: Material; };
  timer: Timer;
}

export default IRendnerRendererMessage;
