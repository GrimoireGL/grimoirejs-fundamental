import MaterialFactory from "./MaterialFactory";
import Unlit from "./Static/Unlit.sort";
import UnlitColor from "./Static/Unlit-Color.sort";
import UnlitTexture from "./Static/Unlit-Textured.sort";
export default class DefaultMaterial {
  public static register(): void {
    MaterialFactory.addSORTMaterial("unlit", Unlit);
    MaterialFactory.addSORTMaterial("unlit-texture", UnlitTexture);
    MaterialFactory.addSORTMaterial("unlit-color", UnlitColor);
  }
}
