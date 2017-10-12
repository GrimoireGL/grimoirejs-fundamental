import Unlit from "raw-loader!../../Shaders/Unlit.sort";
import MaterialFactory from "../MaterialFactory";

/**
 * no document
 */
export default class DefaultMaterial {

  /**
   * no document
   */
  public static async register(): Promise<void> {
    await MaterialFactory.addSORTMaterial("unlit", Unlit);
  }
}
