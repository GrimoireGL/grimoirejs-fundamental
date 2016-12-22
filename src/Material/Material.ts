import ITechniqueRecipe from "./ITechniqueRecipe";
import Technique from "./Technique";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IMaterialArgument from "./IMaterialArgument";
import Pass from "./Pass";
export default class Material {

  public argumentDeclarations: { [key: string]: IAttributeDeclaration } = {};

  private _argumentDeclarationObservers: ((string, IAttributeDeclaration, isAdd: boolean) => void)[] = [];

  public arguments: { [key: string]: any } = {};

  public techniques: { [key: string]: Technique } = {};

  constructor(public gl: WebGLRenderingContext, public techniqueRecipes: { [key: string]: ITechniqueRecipe }) {
    for (let key in techniqueRecipes) {
      this.techniques[key] = new Technique(this, techniqueRecipes[key]);
    }
  }

  public draw(arg: IMaterialArgument): void {
    const technique = this.techniques[arg.technique];
    if (technique) {
      technique.draw(arg);
    }
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
