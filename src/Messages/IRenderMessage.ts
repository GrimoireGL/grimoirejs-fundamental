import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import {Rectangle} from "grimoirejs-math";
import Material from "../Material/Material";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
/**
 * The message args of $render called by RendererComponent.
 */
interface IRenderMessage {
  /**
   * Reference to CameraComponent used for rendering in this time.
   * @type {CameraComponent}
   */
  caller: Component;
  camera: CameraComponent;
  buffers: { [key: string]: Texture2D };
  layer: string;
  viewport: Rectangle;
  material?: Material;
  materialArgs?: { [key: string]: any };
  sceneDescription: { [key: string]: any };
  loopIndex: number;
  defaultTexture: Texture2D;
}

export default IRenderMessage;
