import IMaterialArgument from "./IMaterialArgument";
import Material from "./Material";
import Pass from "./Pass";
import ITechniqueRecipe from "./Schema/ITechniqueRecipe";
/**
 * Technique provides an abstraction of drawing with multiple shaders.
 * Technique represents a draw technique like (basic drawing, normal drawing,low quality drawing and so on)
 * By specifing which technique should be used in a drawing stage, users can easily to switch multiple drawing formulas.
 * @param  {Material}         publicmaterial [description]
 * @param  {ITechniqueRecipe} recipe         [description]
 * @return {[type]}                          [description]
 */
export default class Technique {

  /**
   * Draw prder priorty of this technique
   */
  public drawOrder: string;

  /**
   * Actual drawing stages of this technique
   */
  public passes: Pass[] = [];

  constructor (public material: Material, recipe: ITechniqueRecipe) {
    this.drawOrder = recipe.drawOrder;
    this.passes = recipe.passes.map(p => {
      return new Pass(this, p);
    });
  }

  /**
   * Draw with specified argument by this technique
   * @param {IMaterialArgument} args [description]
   */
  public draw (args: IMaterialArgument): void {
    for (let i = 0; i < this.passes.length; i++) {
      this.passes[i].draw(args);
    }
  }

  /**
   * Destroy to release resources
   */
  public dispose (): void {
    this.passes.forEach(p => p.dispose());
  }
}
