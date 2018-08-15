import Color4 from "grimoirejs-math/ref/Color4";
import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import MaterialFactory from "../Material/MaterialFactory";
import Timer from "../Util/Timer";
import LoopManager from "./LoopManagerComponent";
import GLStateConfigurator from "../Material/GLStateConfigurator";
import { companion, attribute, readonly } from "grimoirejs/ref/Core/Decorator";
import { Color4Converter } from "grimoirejs-math/ref/Converters/Color4Converter";
import { NumberConverter } from "grimoirejs/ref/Converter/NumberConverter";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
/**
 * RendererManager will manage all renderers and provides configurations for entire canvas not managed by viewport.
 */
export default class RendererManager extends Component {
  public static componentName = "RendererManager";
  private static _sortImportedFromHTML = false;

  /**
   * Clear color of canvas
   * This property probably nonsence because this clear color just only for entire canvas.
   * If there were region managed by viewport, clearing feature should be delegated by them.
   * You should see SingleBufferRenderingStage#clearColor also.
   */
  @attribute(Color4Converter, "#00000000")
  public bgColor!: Color4;

  /**
   * Clear depth of canvas
   * This property probably nonsence because this clear color just only for entire canvas.
   * If there were region managed by viewport, clearing feature should be delegated by them.
   * You should see SingleBufferRenderingStage#clearDepth also.
   */
  @attribute(NumberConverter, 1.0)
  public clearDepth!: number;

  /**
   * Flag to complement renderer if there were no renderer on initialization timing.
   * If this value was true, this component will append <renderer> automatically.
   */
  @readonly()
  @attribute(BooleanConverter, true)
  public complementRenderer!: boolean;

  @companion("gl")
  public gl!: WebGLRenderingContext;

  protected $treeInitialized(): void {
    this.node.getComponent(LoopManager)!.register(this.onloop.bind(this), 1000);
    if (this.complementRenderer && this.node.getChildrenByNodeName("renderer").length === 0) {
      this.node.addChildByName("renderer", {});
    }
    this._importSortFromHTML();
  }

  /**
   * The first method that will be called by LoopManager#tick
   * @param timer current timer instance
   */
  public onloop(timer: Timer): void {
    if (this.enabled) {
      const c: Color4 = this.bgColor;
      const gc = GLStateConfigurator.get(this.gl);
      gc.applyIfChanged("clearColor", c.R, c.G, c.B, c.A);
      gc.applyIfChanged("clearDepth", this.clearDepth);
      this.gl.clearDepth(this.clearDepth);
      this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
      this.node.broadcastMessage(1, "renderRenderer", {
        timer,
      });
    }
  }

  private _importSortFromHTML(): void {
    if (RendererManager._sortImportedFromHTML) {
      return;
    }
    const scripts = document.getElementsByTagName("script");
    for (let i = 0; i < scripts.length; i++) {
      i = i;
      const script = scripts.item(i);
      if (script.getAttribute("type") === "text/sort") { // If the script tag is for shader file
        const typeName = script.getAttribute("typeName");
        if (!typeName) {
          throw new Error("Every script tag with 'text/sort' type should have typeName attribute to specify the name to be registered as a material.");
        }
        const src = script.getAttribute("src");
        if (src) {
          MaterialFactory.addSORTMaterialFromURL(typeName, src);
        } else {
          MaterialFactory.addSORTMaterial(typeName, script.innerText);
        }
      }
    }
    RendererManager._sortImportedFromHTML = true;
  }
}
