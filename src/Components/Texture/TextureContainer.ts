import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Texture2D from "../../Resource/Texture2D";
import TextureContainerBase from "./TextureContainerBase";
export default class TextureContainer extends TextureContainerBase<Texture2D> {
  public static componentName = "TextureContainer";
  protected __createTexture(gl: WebGLRenderingContext): Texture2D {
    return new Texture2D(gl);
  }
}
