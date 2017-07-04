import IMaterialArgument from "./IMaterialArgument";
import Material from "./Material";
import Pass from "./Pass";
import ITechniqueRecipe from "./ITechniqueRecipe";
export default class Technique {

  /**
   * Draw prder priorty of this technique
   */
  public drawOrder: string;

  /**
   * Actual drawing stages of this technique
   */
  public passes: Pass[] = [];


  constructor(public material: Material, recipe: ITechniqueRecipe) {
    this.drawOrder = recipe.drawOrder;
    this.passes = recipe.passes.map(p => {
      return new Pass(this, p);
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
