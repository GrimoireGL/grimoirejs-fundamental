import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import ImageResolver from "../../Asset/ImageResolver";
import Texture2D from "../../Resource/Texture2D";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { Nullable } from "grimoirejs/ref/Tool/Types";
import { attribute, watch } from "grimoirejs/ref/Core/Decorator";

export default class ImageTextureUpdator extends TextureUpdatorComponentBase<Texture2D> {
  public static componentName = "ImageTextureUpdator";

  @attribute(StringConverter, null)
  public src!: string;

  private _resolvedImage!: HTMLImageElement;

  public resize(width: number, height: number): void {
    if (this._resolvedImage) {
      this._resolvedImage.width = width;
      this._resolvedImage.height = height;
      this._updateTexture();
    }
  }

  @watch("src", true)
  private async _loadTask(src: string): Promise<void> {
    if (src === null) {
      return;
    }
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
