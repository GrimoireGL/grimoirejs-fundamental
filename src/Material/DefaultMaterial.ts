import MaterialFactory from "./MaterialFactory";
import Unlit from "raw-loader!./Static/Unlit.sort";

export default class DefaultMaterial {
  public static register(): void {
    MaterialFactory.addSORTMaterial("unlit", Unlit);
  }
}
