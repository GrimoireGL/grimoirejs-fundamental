import IMaterialArgument from "./IMaterialArgument";
import Pass from "./Pass";
export default class Material {

  constructor(public pass: Pass[], public drawOrder: string = "AlphaTest") {
  }

  public draw(arg: IMaterialArgument): void {
    this.pass.forEach(p => p.draw(arg));
  }
}
