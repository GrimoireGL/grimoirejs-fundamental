import Color4 from "grimoirejs-math/ref/Color4";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderingTarget from "../../Resource/RenderingTarget/IRenderingTarget";
import RenderStageBase from "./RenderStageBase";

/**
 * no document
 */
export default class SingleBufferRenderStageBase extends RenderStageBase {
  /**
   * no document
   */
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    out: {
      converter: "RenderingTarget",
      default: "default",
    },
    clearColor: {
      default: "#0000",
      converter: "Color4",
    },
    clearColorEnabled: {
      default: true,
      converter: "Boolean",
    },
    clearDepthEnabled: {
      default: true,
      converter: "Boolean",
    },
    clearDepth: {
      default: 1,
      converter: "Number",
    },
  };

  /**
   * no document
   */
  public clearColor: Color4;

  /**
   * no document
   */
  public clearColorEnabled: boolean;

  /**
   * no document
   */
  public clearDepth: number;

  /**
   * no document
   */
  public clearDepthEnabled: boolean;

  /**
   * no document
   */
  public _out: Promise<IRenderingTarget>;

  /**
   * no document
   */
  public out: IRenderingTarget;

  protected $awake(): void {
    this.getAttributeRaw("clearColor").bindTo("clearColor");
    this.getAttributeRaw("clearColorEnabled").bindTo("clearColorEnabled");
    this.getAttributeRaw("clearDepthEnabled").bindTo("clearDepthEnabled");
    this.getAttributeRaw("clearDepth").bindTo("clearDepth");
    this.getAttributeRaw("out").watch(async(promise: Promise<IRenderingTarget>) => {
      this._out = promise;
      this.out = await promise;
    }, true);
  }

  protected __beforeRender(): boolean {
    if (!this.out) {
      return false;
    }
    let clearFlag = 0;
    if (this.clearColorEnabled) {
      clearFlag |= WebGLRenderingContext.COLOR_BUFFER_BIT;
    }
    if (this.clearDepthEnabled) {
      clearFlag |= WebGLRenderingContext.DEPTH_BUFFER_BIT;
    }
    this.out.beforeDraw(clearFlag, this.clearColor.rawElements as number[], this.clearDepth);
    return true;
  }
}
