import Component from "grimoirejs/ref/Node/Component";
import CameraComponent from "../Components/CameraComponent";
import Material from "../Material/Material";
import Viewport from "../Resource/Viewport";
import Timer from "../Util/Timer";
/**
 * The message args of $render called by RendererComponent.
 */
interface IRenderArgument {
  /**
   * Reference to CameraComponent used for rendering in this time.
   * @type {CameraComponent}
   */
  renderer: Component;
  camera: CameraComponent;
  layer: string;
  viewport: Viewport;
  material?: Material;
  materialArgs?: { [key: string]: any };
  sceneDescription: { [key: string]: any };
  rendererDescription: { [key: string]: any };
  timer: Timer;
  technique: string;
  sortingTechnique?: string;
}

export default IRenderArgument;
