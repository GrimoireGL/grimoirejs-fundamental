import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import Rectangle from "grimoirejs-math/ref/Rectangle";
import Material from "../Material/Material";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
/**
 * The message args of $render called by RendererComponent.
 */
interface IRenderArgument {
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
  technique: string;
}

export default IRenderArgument;
