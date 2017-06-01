import RenderBuffer from "../Resource/RenderBuffer";
import Texture2D from "../Resource/Texture2D";
interface IResizeBufferMessage {
  width: number;
  height: number;
  pow2Width: number;
  pow2Height: number;
  buffers: { [key: string]: Texture2D | RenderBuffer };
  bufferSizes: { [bufferName: string]: { width: number, height: number } };
}

export default IResizeBufferMessage;
