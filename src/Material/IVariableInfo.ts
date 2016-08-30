export interface IVariableAnnotation {
  defaultValue: any;
  [key: string]: any;
}
interface IVariableInfo {
  variableName: string;
  variableType: string;
  variablePrecision: string;
  variableAnnotation: IVariableAnnotation;
  isArray: boolean;
  arrayLength: number;
  value?: any;
}
export default IVariableInfo;
