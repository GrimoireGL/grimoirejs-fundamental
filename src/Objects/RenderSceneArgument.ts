import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import Material from "../Material/Material";
import Rectangle from "grimoirejs-math/ref/Rectangle";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
interface RenderSceneArgument {
  camera: CameraComponent;
  buffers: { [key: string]: Texture2D };
  layer: string;
  viewport: Rectangle;
  loopIndex: number;
}

export default RenderSceneArgument;
