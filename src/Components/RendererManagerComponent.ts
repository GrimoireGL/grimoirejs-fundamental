import {Color4} from "grimoirejs-math";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";
import LoopManagerComponent from "./LoopManagerComponent";
import Component from "grimoirejs/lib/Node/Component";
import gr from "grimoirejs";
import {ns} from "../Constants";
export default class RendererManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    bgColor: {
      defaultValue: new Color4(0, 0, 0, 0),
      converter: "Color4"
    },
    clearDepth: {
      defaultValue: 1.0,
      converter: "Number"
    }
  };

  public gl: WebGLRenderingContext;

  private _bgColor: Color4;

  private _clearDepth: number;

  public $awake(): void {
    this.getAttribute("bgColor").boundTo("_bgColor");
    this.getAttribute("clearDepth").boundTo("_clearDepth");
  }

  public $mount(): void {
    this.gl = this.companion.get("gl");
  }

  public $treeInitialized(): void {
    this.tree("goml")("LOOPMANAGER").get<LoopManagerComponent>().register(this.onloop.bind(this), 1000);
    if (this.node.children.length === 0) {
      this.node.addNode("renderer", {});
    }
  }


  public onloop(): void {
    if (this.enabled) {
      const c: Color4 = this._bgColor;
      this.gl.clearColor(c.R, c.G, c.B, c.A);
      this.gl.clearDepth(this._clearDepth);
      this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
      this.node.broadcastMessage(1, "renderScene");
    }
  }
}
