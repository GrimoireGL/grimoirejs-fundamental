import Material from "../Material/Material";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "../Components/CameraComponent";
interface IRenderSceneMessage {
  camera: CameraComponent;
  buffers: { [key: string]: Texture2D };
  layer: string;
  material?: Material;
  materialArgs?: { [key: string]: any };
}

export default IRenderSceneMessage;
