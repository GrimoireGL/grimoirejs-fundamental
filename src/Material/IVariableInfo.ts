interface IVariableInfo {
  name: string;
  type: number;
  count: number;
  semantic: string;
  attributes: { [key: string]: any };
}

export default IVariableInfo;
