import RenderBuffer from "../Resource/RenderBuffer";
import Texture2D from "../Resource/Texture2D";
import Viewport from  "../Resource/Viewport";
interface IResizeViewportMessage {
  width: number;
  height: number;
  pow2Width: number;
  pow2Height: number;
}

export default IResizeViewportMessage;
