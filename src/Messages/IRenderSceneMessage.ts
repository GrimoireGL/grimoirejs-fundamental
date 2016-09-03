import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
interface IRenderSceneMessage {
  camera: CameraComponent;
  buffers: { [key: string]: Texture2D };
  layer: string;
}

export default IRenderSceneMessage;
