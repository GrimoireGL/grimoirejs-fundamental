import IMaterialArgument from "./IMaterialArgument";
import Program from "../Resource/Program";
import ISORTPassInfo from "./ISORTPassInfo";
import Pass from "./Pass";
export default class SORTPass extends Pass {
  constructor(program: Program, attributes: string[], beforeDraw: ((p: Pass, a: IMaterialArgument) => void)[], public programInfo: ISORTPassInfo) {
    super(program, attributes, beforeDraw);
  }
}
