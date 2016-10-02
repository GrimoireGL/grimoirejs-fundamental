import Material from "../Material/Material";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
import {Rectangle} from "grimoirejs-math";
interface IRendnerRendererMessage {
  camera: CameraComponent;
  viewport: Rectangle;
  buffers: { [key: string]: Texture2D };
  material?: Material;
  materialArgs?: { [key: string]: Material; };
  loopIndex: number;
}

export default IRendnerRendererMessage;
