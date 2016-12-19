import Texture2D from "../Resource/Texture2D";
interface IBufferUpdatedMessage {
  buffers: { [key: string]: Texture2D };
  bufferSizes: {
    [key: string]: {
      width: number, height: number
    }
  }
}

export default IBufferUpdatedMessage;
