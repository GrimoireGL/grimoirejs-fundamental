import Texture2D from "../Resource/Texture2D";
interface IBufferUpdatedMessage {
  buffers: { [key: string]: Texture2D };
}

export default IBufferUpdatedMessage;
