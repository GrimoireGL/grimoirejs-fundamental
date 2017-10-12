import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import ImageResolver from "../../Asset/ImageResolver";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";

/**
 * no document
 */
export default class ImageTextureUpdator extends TextureUpdatorComponentBase {

  /**
   * no document
   */
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    src: {
      converter: "String",
      default: null,
    },
  };

  /**
   * no document
   */
  public flipY: boolean;

  /**
   * no document
   */
  public premultipliedAlpha: boolean;

  /**
   * no document
   */
  public src: string;

  /**
   * no document
   */
  protected $awake() {
    super.$awake();
    this.__bindAttributes();
    this.getAttributeRaw("src").watch((v: string) => {
      if (v !== null) {
        this._loadTask(v);
      }
    }, true);
  }

  private async _loadTask(src: string): Promise<void> {
    const image = await ImageResolver.resolve(src);
    this.__texture.update(image, {
      premultipliedAlpha: this.premultipliedAlpha,
      flipY: this.flipY,
    });
  }
}
