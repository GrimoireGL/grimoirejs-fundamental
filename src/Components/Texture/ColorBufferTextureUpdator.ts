import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import RenderingBufferResourceRegistry from "../../Resource/RenderingTarget/RenderingBufferResourceRegistry";
import Texture2D from "../../Resource/Texture2D";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";
import { EnumConverter } from "grimoirejs/ref/Converter/EnumConverter";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import { StandardAttribute } from "grimoirejs/ref/Core/Attribute";
import TextureBufferUpdatorBase from "./TextureBufferUpdatorBase";

export default class ColorBufferTextureUpdator extends TextureBufferUpdatorBase<Texture2D> {
  public static componentName = "ColorBufferTextureUpdator";
  public static attributes = {
    name: {
      converter: StringConverter,
      default: null,
    }
  };

  protected $awake(): void {
    super.$awake();
    const name = this.getAttribute(ColorBufferTextureUpdator.attributes.name);
    if (name) {
      RenderingBufferResourceRegistry.get(this.companion.get("gl")!).setBackbuffer(this.getAttribute(ColorBufferTextureUpdator.attributes.name), this.__texture);
    }
    this.__texture.update(0, 1, 1, 0, this.format, this.type, null);
  }

  public resize(width: number, height: number): void {
    this.__texture.update(0, width, height, 0, this.format, this.type, null);
  }
}
