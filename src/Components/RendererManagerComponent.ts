import LoopManagerComponent from "./LoopManagerComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
import gr from "grimoirejs";
import {ns} from "../Constants";
export default class RendererManagerComponent extends Component {
  public $mount() {
    this.tree("goml")("LoopManager").get<LoopManagerComponent>().register(this.onloop.bind(this), 1000);
  }

  public onloop(): void {
    const gl: WebGLRenderingContext = this.sharedObject.get("gl");
    gl.clearColor(1, 0, 0, 1);
    gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
  }
}
