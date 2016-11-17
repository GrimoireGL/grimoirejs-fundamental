import MaterialFactory from "./MaterialFactory";
import Unlit from "raw!./Static/Unlit.sort";
import UnlitColor from "raw!./Static/Unlit-Color.sort";
import UnlitTexture from "raw!./Static/Unlit-Textured.sort";
export default class DefaultMaterial {
  public static register(): void {
    MaterialFactory.addSORTMaterial("unlit", Unlit);
    MaterialFactory.addSORTMaterial("unlit-texture", UnlitTexture);
    MaterialFactory.addSORTMaterial("unlit-color", UnlitColor);
  }
}
