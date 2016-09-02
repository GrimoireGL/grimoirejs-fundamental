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
  arrayLength: number;
}
export default IVariableInfo;
