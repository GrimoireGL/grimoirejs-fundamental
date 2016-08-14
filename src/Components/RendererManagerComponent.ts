import LoopManagerComponent from "./LoopManagerComponent";
import Component from "grimoirejs/lib/Core/Node/Component";
import gr from "grimoirejs";
import {ns} from "../Constants";
export default class RendererManagerComponent extends Component {
  public $mount() {
    this.tree("goml")("LoopManager").get<LoopManagerComponent>().register(this.onloop, 1000);
  }

  public onloop(): void {
    console.log("loop");
  }
}
