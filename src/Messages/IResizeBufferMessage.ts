import RenderBuffer from "../Resource/RenderBuffer";
import Texture2D from "../Resource/Texture2D";
interface IResizeBufferMessage {
  width: number;
  height: number;
  widthPowerOf2: number;
  heightPowerOf2: number;
  buffers: { [key: string]: Texture2D | RenderBuffer };
}

export default IResizeBufferMessage;
