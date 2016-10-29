export interface IVariableAnnotation {
  default: string;
  [key: string]: any;
}
interface IVariableInfo {
  variableName: string;
  variableType: string;
  variablePrecision: string;
  variableAnnotation: IVariableAnnotation;
  isArray: boolean;
  arrayLength: (macros: { [key: string]: string }) => number;
}
export default IVariableInfo;
