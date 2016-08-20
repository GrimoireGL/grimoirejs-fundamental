import CameraComponent from "../Components/CameraComponent";
import RendererComponent from "../Components/RendererComponent";
/**
 * The message args of $render called by RendererComponent.
 */
interface IRenderMessageArgs {
  /**
   * Reference to CameraComponent used for rendering in this time.
   * @type {CameraComponent}
   */
  camera: CameraComponent;
  /**
   * The renderer reference called this rendering.
   * @type {RendererComponent}
   */
  renderer: RendererComponent;
}

export default IRenderMessageArgs;
