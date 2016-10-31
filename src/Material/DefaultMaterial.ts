import MaterialFactory from "./MaterialFactory";
import Unlit from "./Static/Unlit.sort";

export default class DefaultMaterial {
  public static register(): void {
    MaterialFactory.addSORTMaterial("unlit", Unlit);
  }
}
