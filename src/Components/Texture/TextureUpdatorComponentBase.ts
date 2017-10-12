import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Texture2D from "../../Resource/Texture2D";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import TextureContainer from "./TextureContainer";

/**
 * no document
 */
export default class TextureUpdatorComponentBase extends ResizableResourceUpdator {

  /**
   * no document
   */
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    flipY: {
      converter: "Boolean",
      default: false,
    },
    premultipliedAlpha: {
      converter: "Boolean",
      default: false,
    },
  };

  private textureComponent: TextureContainer;
  protected get __texture(): Texture2D {
    return this.textureComponent.texture;
  }

  protected $awake(): void {
    super.$awake();
    this.textureComponent = this.node.getComponent(TextureContainer);
  }
}
