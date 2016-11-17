import IMaterialArgument from "./IMaterialArgument";
import Program from "../Resource/Program";
export default class Pass {
  /**
   * [program description]
   * @type {Program}
   */
  public program: Program;

  public attributes: string[] = [];

  public draw(arg: IMaterialArgument): void {
    if (!this.program) {
      return;
    }
    this.program.use();
    this.__beforeDraw(arg);
    arg.geometry.draw(arg.targetBuffer, this.attributes, this.program, arg.drawCount, arg.drawOffset);
  }

  protected __beforeDraw(arg: IMaterialArgument) {
    // Should be overrrided or rewritten
  }
}
