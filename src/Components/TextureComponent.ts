import gr from "grimoirejs";
import Texture2D from "../Resource/Texture2D";
const Component = gr.Node.Component;
const IAttributeDeclaration = gr.Node.IAttributeDeclaration;
import ImageResolver from "../Asset/ImageResolver";
export default class TextureComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    src: {
      converter: "String",
      defaultValue: undefined
    },
    minFilter: {
      converter: "Enum",
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
      converter: "Enum",
      defaultValue: "LINEAR",
      table: {
        LINEAR: WebGLRenderingContext.LINEAR,
        NEAREST: WebGLRenderingContext.NEAREST
      }
    },
    wrapS: {
      converter: "Enum",
      defaultValue: "REPEAT",
      table: {
        REPEAT: WebGLRenderingContext.REPEAT,
        MIRRORED_REPEAT: WebGLRenderingContext.MIRRORED_REPEAT,
        CLAMP_TO_EDGE: WebGLRenderingContext.CLAMP_TO_EDGE
      }
    },
    wrapT: {
      converter: "Enum",
      defaultValue: "REPEAT",
      table: {
        REPEAT: WebGLRenderingContext.REPEAT,
        MIRRORED_REPEAT: WebGLRenderingContext.MIRRORED_REPEAT,
        CLAMP_TO_EDGE: WebGLRenderingContext.CLAMP_TO_EDGE
      }
    }
  };

  private _texture: Texture2D;

  public $mount(): void {
    const src = this.getValue("src");
    this._texture = new Texture2D(this.companion.get("gl"));
    this._texture.magFilter = this.getValue("magFilter");
    this._texture.minFilter = this.getValue("minFilter");
    this._texture.wrapT = this.getValue("wrapT");
    this._texture.wrapS = this.getValue("wrapS");
    this.attributes.get("magFilter").addObserver(v => this._texture.magFilter = v.Value);
    this.attributes.get("minFilter").addObserver(v => this._texture.minFilter = v.Value);
    this.attributes.get("wrapS").addObserver(v => this._texture.wrapS = v.Value);
    this.attributes.get("wrapT").addObserver(v => this._texture.wrapT = v.Value);
    if (src) {
      this._loadTask(src);
    }
  }

  private async _loadTask(src: string): Promise<void> {
    const img = await ImageResolver.resolve(src);
    this._texture.update(img);
  }
}
