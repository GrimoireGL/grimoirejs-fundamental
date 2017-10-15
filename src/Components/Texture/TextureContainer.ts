import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Texture2D from "../../Resource/Texture2D";
import CanvasInitializerComponent from "../CanvasInitializerComponent";
export default class TextureContainer extends Component {
  public static componentName = "TextureContainer";
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    minFilter: {
      converter: "Enum",
      default: "LINEAR",
      table: {
        LINEAR: WebGLRenderingContext.LINEAR,
        NEAREST: WebGLRenderingContext.NEAREST,
        NEAREST_MIPMAP_NEAREST: WebGLRenderingContext.NEAREST_MIPMAP_NEAREST,
        NEAREST_MIPMAP_LINEAR: WebGLRenderingContext.NEAREST_MIPMAP_LINEAR,
        LINEAR_MIPMAP_NEAREST: WebGLRenderingContext.LINEAR_MIPMAP_NEAREST,
        LINEAR_MIPMAP_LINEAR: WebGLRenderingContext.LINEAR_MIPMAP_LINEAR,
      },
    },
    magFilter: {
      converter: "Enum",
      default: "LINEAR",
      table: {
        LINEAR: WebGLRenderingContext.LINEAR,
        NEAREST: WebGLRenderingContext.NEAREST,
      },
    },
    wrapS: {
      converter: "Enum",
      default: "REPEAT",
      table: {
        REPEAT: WebGLRenderingContext.REPEAT,
        MIRRORED_REPEAT: WebGLRenderingContext.MIRRORED_REPEAT,
        CLAMP_TO_EDGE: WebGLRenderingContext.CLAMP_TO_EDGE,
      },
    },
    wrapT: {
      converter: "Enum",
      default: "REPEAT",
      table: {
        REPEAT: WebGLRenderingContext.REPEAT,
        MIRRORED_REPEAT: WebGLRenderingContext.MIRRORED_REPEAT,
        CLAMP_TO_EDGE: WebGLRenderingContext.CLAMP_TO_EDGE,
      },
    },
  };

  public texture: Texture2D;

  protected $mount(): void {
    this.texture = new Texture2D(this.companion.get(CanvasInitializerComponent.COMPANION_KEY_GL));
    this.texture.magFilter = this.getAttribute("magFilter");
    this.texture.minFilter = this.getAttribute("minFilter");
    this.texture.wrapT = this.getAttribute("wrapT");
    this.texture.wrapS = this.getAttribute("wrapS");
    this.getAttributeRaw("magFilter").watch(v => this.texture.magFilter = v);
    this.getAttributeRaw("minFilter").watch(v => this.texture.minFilter = v);
    this.getAttributeRaw("wrapS").watch(v => this.texture.wrapS = v);
    this.getAttributeRaw("wrapT").watch(v => this.texture.wrapT = v);
  }

  protected $unmount(): void {
    this.texture.destroy();
    this.texture = null;
  }
}
