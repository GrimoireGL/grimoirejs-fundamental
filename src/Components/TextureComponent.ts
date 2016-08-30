import Texture2D from "../Resource/Texture2D";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import ImageResolver from "../Asset/ImageResolver";
export default class TextureComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    src: {
      converter: "string",
      defaultValue: undefined
    }
  };

  private texture: Texture2D;

  public $mount(): void {
    const src = this.getValue("src");
    this.texture = new Texture2D(this.companion.get("gl"));
    if (src) {
      this.loadTask(src);
    }
  }

  private async loadTask(src: string): Promise<void> {
    const img = await ImageResolver.resolve(src);
    this.texture.update(img);
  }
}
