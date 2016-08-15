import Color4 from "grimoirejs/lib/Core/Math/Color4";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import LoopManagerComponent from "./LoopManagerComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
// import gr from "grimoirejs";
// import {ns} from "../Constants";
export default class RendererManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    enabled: {
      defaultValue: true,
      converter: "boolean"
    },
    bgColor: {
      defaultValue: new Color4(0, 0, 0, 1),
      converter: "color4"
    }
  };

  public gl: WebGLRenderingContext;

  private _enabled: boolean;

  public $mount(): void {
    this.tree("goml")("LoopManager").get<LoopManagerComponent>().register(this.onloop.bind(this), 1000);
    this.gl = this.sharedObject.get("gl");
    const e = this.attributes.get("enabled");
    this._enabled = e.Value;
    e.addObserver((a) => {
      this._enabled = a.Value;
    });
  }

  public onloop(): void {
    if (this._enabled) {
      const c: Color4 = this.attributes.get("bgColor").Value as Color4;
      this.gl.clearColor(c.R, c.G, c.B, c.A);
      this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
    }
  }
}
