import MaterialFactory from "./MaterialFactory";
import ITechniqueRecipe from "./ITechniqueRecipe";
import Technique from "./Technique";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IMaterialArgument from "./IMaterialArgument";
import Pass from "./Pass";
export default class Material {

  public factory:MaterialFactory;

  public argumentDeclarations: { [key: string]: IAttributeDeclaration } = {};

  public arguments: { [key: string]: any } = {};

  public macroDeclarations: { [key: string]: IAttributeDeclaration } = {};

  public techniques: { [key: string]: Technique } = {};

  private _macroObserver: { [key: string]: ((value: boolean | number) => void)[] } = {};

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

  public addMacroObserver(key: string, macroDeclaration: IAttributeDeclaration, onChanged: (value: boolean | number) => void): void {
    if (!this._macroObserver[key]) {
      this._macroObserver[key] = [];
    }
    this._macroObserver[key].push(onChanged);
    this.macroDeclarations[key] = macroDeclaration;
  }

  public setMacroValue(key: string, value: boolean | number): void {
    if (this._macroObserver[key]) {
      this._macroObserver[key].forEach(o => o(value));
    }
  }

  public addArgument(key: string, argumentDeclaration: IAttributeDeclaration): void {
    this.argumentDeclarations[key] = argumentDeclaration;
  }

  public deleteArgument(key: string): void {
    delete this.argumentDeclarations[key];
  }
}
