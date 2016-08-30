import IVariableInfo from "./IVariableInfo";
interface IProgramTransformInfo {
  fragment: string;
  vertex: string;
  uniforms: { [variableName: string]: IVariableInfo };
  attributes: { [variableName: string]: IVariableInfo };
  fragmentPrecision: { [key: string]: string };
  vertexPrecision: { [key: string]: string };
}

export default IProgramTransformInfo;
