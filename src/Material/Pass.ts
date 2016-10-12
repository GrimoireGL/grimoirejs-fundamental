import IMaterialArgument from "./IMaterialArgument";
import Program from "../Resource/Program";
export default class Pass {
  constructor(public program: Program, public attributes: string[], public beforeDraw: ((p: Pass, a: IMaterialArgument) => void)[]) {

  }

  public draw(arg: IMaterialArgument): void {
    this.program.use();
    for (let i = 0; i < this.beforeDraw.length; i++) {
      this.beforeDraw[i](this, arg);
    }
    arg.geometry.draw(arg.targetBuffer, this.attributes, this.program, arg.drawCount, arg.drawOffset);
  }
}
