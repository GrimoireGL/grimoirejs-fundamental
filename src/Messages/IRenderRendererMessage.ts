import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import Material from "../Material/Material";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
import Rectangle from "grimoirejs-math/ref/Rectangle";
interface IRendnerRendererMessage {
  camera: CameraComponent;
  viewport: Rectangle;
  buffers: { [key: string]: Texture2D };
  bufferSize: { width: number, height: number };
  material?: Material;
  materialArgs?: { [key: string]: Material; };
  loopIndex: number;
}

export default IRendnerRendererMessage;
