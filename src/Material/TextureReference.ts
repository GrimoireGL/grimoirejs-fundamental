import Texture2D from "../Resource/Texture2D";
/**
 * Proxy of texture reference
 */
export default class TextureReference {
  public isFunctionalProxy: boolean;

  constructor(public rawResource: Texture2D | ((val: { [key: string]: Texture2D }) => Texture2D)) {
    this.isFunctionalProxy = (typeof rawResource) === "function";
  }

  public get(): Texture2D;
  public get(buffers: { [key: string]: Texture2D }): Texture2D;
  public get(buffers?: { [key: string]: Texture2D }): Texture2D {
    if (!this.isFunctionalProxy) {
      return this.rawResource as Texture2D;
    } else {
      return (this.rawResource as ((val: { [key: string]: Texture2D }) => Texture2D))(buffers!);
    }
  }
}
