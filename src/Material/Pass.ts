import IMaterialArgument from "./IMaterialArgument";
import Program from "../Resource/Program";
export default class Pass {
  constructor(public program: Program, public beforePath: (program: Program, arg: IMaterialArgument) => void) {

  }

  public draw(arg: IMaterialArgument): void {
    this.program.use();
    this.beforePath(this.program, arg);
    arg.geometry.draw(arg.targetBuffer, ["position"], this.program);
  }
}
