import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import Material from "../Material/Material";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
import Rectangle from "grimoirejs-math/ref/Rectangle";
import Timer from "../Util/Timer";
import Viewport from "../Resource/Viewport";
interface IRendnerRendererMessage {
  camera: CameraComponent;
  viewport: Viewport;
  material?: Material;
  materialArgs?: { [key: string]: Material; };
  timer: Timer;
}

export default IRendnerRendererMessage;
