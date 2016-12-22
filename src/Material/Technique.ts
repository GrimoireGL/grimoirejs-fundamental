import Pass from "./Pass";
import ITechniqueRecipe from "./ITechniqueRecipe";
export default class Technique {

  public drawOrder: string;

  public passes: Pass[] = [];

  constructor(recipe: ITechniqueRecipe) {
    this.drawOrder = recipe.drawOrder;
  }
}