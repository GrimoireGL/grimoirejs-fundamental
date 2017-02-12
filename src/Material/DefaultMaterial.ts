import MaterialFactory from "./MaterialFactory";
import Unlit from "raw-loader!./Static/Unlit.sort";
import UnlitColor from "raw-loader!./Static/Unlit-Color.sort";
import UnlitTexture from "raw-loader!./Static/Unlit-Textured.sort";
export default class DefaultMaterial {
  public static register(): void {
    MaterialFactory.addSORTMaterial("unlit", Unlit);
  }
}
