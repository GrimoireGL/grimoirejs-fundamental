import IVariableInfo from "../IVariableInfo";
import ITransformingArgument from "./ITransformingArgument";
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
    let isArray = regexResult[5] !== void 0;
    let arrayCount = undefined;
    if (isArray) {
      arrayCount = parseInt(regexResult[5], 10);
      if (isNaN(arrayCount)) {

      }
    }
    result[name] = <IVariableInfo>{
      variableName: name,
      variableType: type,
      variablePrecision: precision,
      variableAnnotation: rawAnnotations ? _parseVariableAttributes(rawAnnotations) : {},
      isArray: isArray,
      arrayLength: arrayCount
    };
  }
  return result;
}

export default function(type: string): (arg: ITransformingArgument) => Promise<ITransformingArgument> {
  return async function(arg: ITransformingArgument): Promise<ITransformingArgument> {
    const variables = _parseVariables(arg.info.shaderSource, type);
    switch (type) {
      case "uniform":
        arg.info.uniforms = variables;
        break;
      case "attribute":
        arg.info.attributes = variables;
        break;
      default:
        throw new Error("Unknown variable type!!");
    }
    return arg;
  };
}
