import IMacro from "./IMacro";
import IState from "./IState";
import IVariableInfo from "./IVariableInfo";
interface IPassRecipe {
  extensions: string[];
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
