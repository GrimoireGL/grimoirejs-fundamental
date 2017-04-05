import Texture2D from "../Resource/Texture2D";
/**
 * Proxy of texture reference
 */
class TextureReference {
  private _isFunctionalProxy: boolean;

  constructor(public rawResource: Texture2D | ((val: { [key: string]: Texture2D }) => Texture2D)) {
    this._isFunctionalProxy = (typeof rawResource) === "function";
  }

  public get(): Texture2D;
  public get(buffers: { [key: string]: Texture2D }): Texture2D;
  public get(buffers?: { [key: string]: Texture2D }): Texture2D {
    if (!this._isFunctionalProxy) {
      return this.rawResource as Texture2D;
    } else {
      return (this.rawResource as ((val: { [key: string]: Texture2D }) => Texture2D))(buffers);
    }
  }
}

export default TextureReference;
