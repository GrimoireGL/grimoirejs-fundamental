import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import ImageResolver from "../../Asset/ImageResolver";
import Texture2D from "../../Resource/Texture2D";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { Nullable } from "grimoirejs/ref/Tool/Types";

export default class ImageTextureUpdator extends TextureUpdatorComponentBase<Texture2D> {
  public static componentName = "ImageTextureUpdator";
  public static attributes = {
    src: {
      converter: StringConverter,
      default: null,
    },
    ...TextureUpdatorComponentBase.attributes
  };

  public flipY!: boolean;

  public premultipliedAlpha!: boolean;

  public src!: string;

  private _resolvedImage!: HTMLImageElement;

  protected $awake() {
    super.$awake();
    this.__bindAttributes();
    this.getAttributeRaw(ImageTextureUpdator.attributes.src)!.watch((v: Nullable<string>) => {
      if (v !== null) {
        this._loadTask(v);
      }
    }, true);
  }

  public resize(width: number, height: number): void {
    if (this._resolvedImage) {
      this._resolvedImage.width = width;
      this._resolvedImage.height = height;
      this._updateTexture();
    }
  }

  private async _loadTask(src: string): Promise<void> {
    const image = await ImageResolver.resolve(src);
    this._resolvedImage = image;
    this._updateTexture();
  }

  private _updateTexture(): void {
    this.__texture.update(this._resolvedImage, {
      premultipliedAlpha: this.premultipliedAlpha,
      flipY: this.flipY,
    });
  }
}
