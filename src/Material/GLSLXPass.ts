import IMaterialArgument from "./IMaterialArgument";
import Program from "../Resource/Program";
import IProgramTransformInfo from "./IProgramTransformInfo";
import Pass from "./Pass";
export default class GLSLXPass extends Pass {
  constructor(program: Program, beforePath: (program: Program, arg: IMaterialArgument) => void, public programInfo: IProgramTransformInfo) {
    super(program, beforePath);
  }
}
