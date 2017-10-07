import IMacro from "./IMacro";
import IState from "./IState";
import IVariableInfo from "./IVariableInfo";
interface IPassRecipe {
  fragment: string;
  vertex: string;
  uniforms: {
    [key: string]: IVariableInfo;
  };
  attributes: {
    [key: string]: IVariableInfo; // variable-name to semantic key
  };
  macros: {
    [key: string]: IMacro;
  };
  states: IState;
}

export default IPassRecipe;
