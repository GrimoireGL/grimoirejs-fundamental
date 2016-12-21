import IState from "./IState";
interface IPassRecipe {
  fragment: string;
  vertex: string;
  uniforms: {
    [key: string]: {
      type: number;
      count: number;
      default: any;
      semantic: string;
      node?: string;
    };
  },
  attributes: {
    [key: string]: string; // variable-name to semantic key
  },
  macros: {
    [key: string]: {

    };
  },
  states: IState
}

export default IPassRecipe;