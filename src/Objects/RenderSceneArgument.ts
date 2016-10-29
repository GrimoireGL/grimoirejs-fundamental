import Component from "grimoirejs/lib/Node/Component";
import Material from "../Material/Material";
import {Rectangle} from "grimoirejs-math";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
interface RenderSceneArgument {
  caller: Component;
  camera: CameraComponent;
  buffers: { [key: string]: Texture2D };
  layer: string;
  viewport: Rectangle;
  material?: Material;
  materialArgs?: { [key: string]: any };
  loopIndex: number;
}

export default RenderSceneArgument;
