import IMaterialArgument from "./IMaterialArgument";
import Material from "./Material";
import Pass from "./Pass";
import ITechniqueRecipe from "./ITechniqueRecipe";
export default class Technique {

  public drawOrder: string;

  public passes: Pass[] = [];

  constructor(public material: Material, recipe: ITechniqueRecipe) {
    if (recipe.drawOrder === "Auto") { // TODO auto generate drawOrder calculated by material argument
      this.drawOrder = "UseAlpha";
    }else {
      this.drawOrder = recipe.drawOrder;
    }
    this.passes = recipe.passes.map(p => {
      return new Pass(material, p);
    });
  }

  public draw(args: IMaterialArgument): void {
    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].draw(args);
    }
  }

  public dispose(): void {
    this.passes.forEach(p => p.dispose());
  }
}
