import IPassRecipe from "./IPassRecipe";
interface ITechniqueRecipe {
  passes: IPassRecipe[];
  drawOrder: string;
}

export default ITechniqueRecipe;
