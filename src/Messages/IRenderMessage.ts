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
  camera: CameraComponent;

  buffers: { [key: string]: Texture2D };

  layer: string;
}

export default IRenderMessage;
