import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IMaterialArgument from "./IMaterialArgument";
import Pass from "./Pass";
export default class Material {

  public argumentDeclarations: { [key: string]: IAttributeDeclaration } = {};

  private _argumentDeclarationObservers: ((string, IAttributeDeclaration, isAdd: boolean) => void)[] = [];

  public arguments: { [key: string]: any } = {};

  constructor(public pass: Pass[], public drawOrder: string = "UseAlpha") {
  }

  public draw(arg: IMaterialArgument): void {
    this.pass.forEach(p => p.draw(arg));
  }

  public addArgument(key: string, argumentDeclaration: IAttributeDeclaration): void {
    this.argumentDeclarations[key] = argumentDeclaration;
    this._argumentDeclarationObservers.forEach(o => o(key, argumentDeclaration, true));
  }

  public onArgumentChange(handler: ((string, IAttributeDeclaration, isAdd: boolean) => void)): void {
    this._argumentDeclarationObservers.push(handler);
  }

  public offArgumentChange(handler: ((string, IAttributeDeclaration, isAdd: boolean) => void)): void {
    const index = this._argumentDeclarationObservers.indexOf(handler);
    if (index > -1) {
      this._argumentDeclarationObservers.splice(index, 1);
    }
  }

  public deleteArgument(key: string): void {
    this._argumentDeclarationObservers.forEach(o => o(key, this.argumentDeclarations[key], false));
    this.argumentDeclarations[key] = null;
  }
}
