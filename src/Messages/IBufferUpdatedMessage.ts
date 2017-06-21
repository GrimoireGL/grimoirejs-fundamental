import Texture2D from "../Resource/Texture2D";
import Viewport from "../Resource/Viewport";
interface IBufferUpdatedMessage {
  buffers: { [key: string]: Texture2D };
  bufferViewports: {
    [key: string]: Viewport;
  };
}

export default IBufferUpdatedMessage;
