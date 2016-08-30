import IVariableInfo from "./IVariableInfo";
interface IProgramTransformInfo {
  fragment: string;
  vertex: string;
  uniforms: { [variableName: string]: IVariableInfo };
  attributes: { [variableName: string]: IVariableInfo };
}

export default IProgramTransformInfo;
