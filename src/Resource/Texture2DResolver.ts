import ImageResolver from "../Asset/ImageResolver";
import Texture2D from "./Texture2D";
import ExternalResourceResolver from "../Asset/ExternalResourceResolver";
export default class Texture2DResolver extends ExternalResourceResolver<Texture2D> {
  constructor(public gl: WebGLRenderingContext) {
    super();
  }

  public async resolve(path: string): Promise<Texture2D> {
    const img = await ImageResolver.resolve(path);
    const tex = new Texture2D(this.gl);
    tex.update(img);
    return tex;
  }

}
