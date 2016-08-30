import IVariableInfo from "../IVariableInfo";
import ITransformingInfo from "./ITransformingInfo";
import JSON5 from "json5";
function _parseVariableAttributes(attributes: string): { [key: string]: string } {
  return JSON5.parse(attributes);
}

function _generateVariableFetchRegex(variableType: string): RegExp {
  return new RegExp(`(?:@(\\{.+\\}))?\\s*${variableType}\\s+(?:(lowp|mediump|highp)\\s+)?([a-z0-9A-Z]+)\\s+([a-zA-Z0-9_]+)(?:\\s*\\[\\s*(\\d+)\\s*\\]\\s*)?\\s*;`, "g");
}

function _parseVariables(source: string, variableType: string): { [key: string]: IVariableInfo } {
  const result = {};
  const regex = _generateVariableFetchRegex(variableType);
  let regexResult: RegExpExecArray;
  while ((regexResult = regex.exec(source))) {
    let name = regexResult[4];
    let type = regexResult[3];
    let precision = regexResult[2];
    let rawAnnotations = regexResult[1];
    result[name] = <IVariableInfo>{
      variableName: name,
      variableType: type,
      variablePrecision: precision,
      variableAnnotation: rawAnnotations ? _parseVariableAttributes(rawAnnotations) : {},
      isArray: (typeof regexResult[5] !== "undefined"),
      arrayLength: (typeof regexResult[5] !== "undefined") ? parseInt(regexResult[5], 10) : undefined
    };
  }
  return result;
}

export default function(type: string): (info: ITransformingInfo) => Promise<ITransformingInfo> {
  return async function(info: ITransformingInfo): Promise<ITransformingInfo> {
    const variables = _parseVariables(info.transforming, type);
    switch (type) {
      case "uniform":
        info.info.uniforms = variables;
        break;
      case "attribute":
        info.info.attributes = variables;
        break;
      default:
        throw new Error("Unknown variable type!!");
    }
    return info;
  };
}
