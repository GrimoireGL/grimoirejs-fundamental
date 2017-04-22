import RenderSceneComponent from "../Components/RenderSceneComponent";
import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import Rectangle from "grimoirejs-math/ref/Rectangle";
import Material from "../Material/Material";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
import Timer from "../Util/Timer";
/**
 * The message args of $render called by RendererComponent.
 */
interface IRenderArgument {
  /**
   * Reference to CameraComponent used for rendering in this time.
   * @type {CameraComponent}
   */
  renderer: RenderSceneComponent;
  camera: CameraComponent;
  buffers: { [key: string]: Texture2D };
  layer: string;
  viewport: Rectangle;
  material?: Material;
  materialArgs?: { [key: string]: any };
  sceneDescription: { [key: string]: any };
  timer: Timer;
  technique: string;
}

export default IRenderArgument;
