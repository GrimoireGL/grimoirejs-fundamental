import IVariableInfo from "./IVariableInfo";
import IState from "./IState";
interface IPassRecipe {
  fragment: string;
  vertex: string;
  uniforms: {
    [key: string]: IVariableInfo;
  },
  attributes: {
    [key: string]: IVariableInfo; // variable-name to semantic key
  },
  macros: {
    [key: string]: {

    };
  },
  states: IState
}

export default IPassRecipe;