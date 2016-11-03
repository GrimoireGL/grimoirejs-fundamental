import MaterialFactory from "./MaterialFactory";
import IMaterialArgument from "./IMaterialArgument";
import ISORTPassInfo from "./Transformers/Interfaces/ISORTPassInfo";
import SORTPass from "./SORTPass";
import UniformProxy from "../Resource/UniformProxy";
import Program from "../Resource/Program";
import Shader from "../Resource/Shader";
import SORTPassParser from "./Transformers/SORTPassParser";
import MacroRegistory from "./MacroRegistory";

export default class PassFactory {

  public static passInfoFromSORT(source: string): Promise<ISORTPassInfo[]> { // TODO should notify warning if there was some of code above of @Pass
    let splitted = source.split("@Pass");
    splitted.splice(0, 1);// Separate with @Pass and if there was some pass without containing @, that would be skipped since that is assumed as empty.
    return Promise.all(splitted.map(p => SORTPassParser.parse(p)));
  }
}
