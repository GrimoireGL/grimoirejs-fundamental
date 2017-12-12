import Skybox from "raw-loader!../../Shaders/Skybox.sort";
import Unlit from "raw-loader!../../Shaders/Unlit.sort";
import MaterialFactory from "../MaterialFactory";
export default class DefaultMaterial {
  public static register(): void {
    MaterialFactory.addSORTMaterial("unlit", Unlit);
    MaterialFactory.addSORTMaterial("skybox", Skybox);
  }
}
