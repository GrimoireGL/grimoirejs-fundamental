interface IVariableInfo {
  name: string;
  type: number;
  count: number;
  default: any;
  semantic: string;
  attributes: { [key: string]: any };
};

export default IVariableInfo;