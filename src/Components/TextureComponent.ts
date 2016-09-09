import Texture2D from "../Resource/Texture2D";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";
import ImageResolver from "../Asset/ImageResolver";
export default class TextureComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    src: {
      converter: "string",
      defaultValue: undefined
    },
    minFilter: {
      converter: "enum",
      defaultValue: "LINEAR",
      table: {
        LINEAR: WebGLRenderingContext.LINEAR,
        NEAREST: WebGLRenderingContext.NEAREST,
        NEAREST_MIPMAP_NEAREST: WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,
        NEAREST_MIPMAP_LINEAR: WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,
        LINEAR_MIPMAP_NEAREST: WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,
        LINEAR_MIPMAP_LINEAR: WebGLRenderingContext.LINEAR_MIPMAP_LINEAR
      }
    },
    magFilter: {
      converter: "enum",
      defaultValue: "LINEAR",
      table: {
        LINEAR: WebGLRenderingContext.LINEAR,
        NEAREST: WebGLRenderingContext.NEAREST
      }
    },
    wrapS: {
      converter: "enum",
      defaultValue: "REPEAT",
      table: {
        REPEAT: WebGLRenderingContext.REPEAT,
        MIRRORED_REPEAT: WebGLRenderingContext.MIRRORED_REPEAT,
        CLAMP_TO_EDGE: WebGLRenderingContext.CLAMP_TO_EDGE
      }
    },
    wrapT: {
      converter: "enum",
      defaultValue: "REPEAT",
      table: {
        REPEAT: WebGLRenderingContext.REPEAT,
        MIRRORED_REPEAT: WebGLRenderingContext.MIRRORED_REPEAT,
        CLAMP_TO_EDGE: WebGLRenderingContext.CLAMP_TO_EDGE
      }
    }
  };

  private texture: Texture2D;

  public $mount(): void {
    const src = this.getValue("src");
    this.texture = new Texture2D(this.companion.get("gl"));
    this.texture.magFilter = this.getValue("magFilter");
    this.texture.minFilter = this.getValue("minFilter");
    this.texture.wrapT = this.getValue("wrapT");
    this.texture.wrapS = this.getValue("wrapS");
    this.attributes.get("magFilter").addObserver(v => this.texture.magFilter = v.Value);
    this.attributes.get("minFilter").addObserver(v => this.texture.minFilter = v.Value);
    this.attributes.get("wrapS").addObserver(v => this.texture.wrapS = v.Value);
    this.attributes.get("wrapT").addObserver(v => this.texture.wrapT = v.Value);
    if (src) {
      this.loadTask(src);
    }
  }

  private async loadTask(src: string): Promise<void> {
    const img = await ImageResolver.resolve(src);
    this.texture.update(img);
  }
}
