import Texture2D from "../Resource/Texture2D";
interface IResizeBufferMessage {
  width: number;
  height: number;
  buffers: { [key: string]: Texture2D };
}

export default IResizeBufferMessage;
