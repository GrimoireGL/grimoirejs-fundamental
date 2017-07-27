import RenderBuffer from "../Resource/RenderBuffer";
import Texture2D from "../Resource/Texture2D";
import Viewport from  "../Resource/Viewport";
interface IResizeBufferMessage {
  width: number;
  height: number;
  pow2Width: number;
  pow2Height: number;
  buffers: { [key: string]: Texture2D | RenderBuffer };
  bufferViewports: { [bufferName: string]: Viewport };
}

export default IResizeBufferMessage;
