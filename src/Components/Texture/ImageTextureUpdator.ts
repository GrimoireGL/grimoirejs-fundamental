import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import ImageResolver from "../../Asset/ImageResolver";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";

export default class ImageTextureUpdator extends TextureUpdatorComponentBase {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    src: {
      converter: "String",
      default: null,
    },
  };

  public flipY: boolean;

  public premultipliedAlpha: boolean;

  public src: string;

  public $awake () {
    super.$awake();
    this.__bindAttributes();
    this.getAttributeRaw("src").watch((v: string) => {
      if (v !== null) {
        this._loadTask(v);
      }
    }, true);
  }

  private async _loadTask (src: string): Promise<void> {
    const image = await ImageResolver.resolve(src);
    this.__texture.update(image, {
      premultipliedAlpha: this.premultipliedAlpha,
      flipY: this.flipY,
    });
  }
}
