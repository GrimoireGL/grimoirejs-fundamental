import ITransformingInfo from "./ITransformingInfo";
function _removeVariableAnnotations(source: string): string {
  let regexResult: RegExpExecArray;
  while (regexResult = /@\{.+\}/g.exec(source)) {
    source = source.substr(0, regexResult.index) + source.substring(regexResult.index + regexResult[0].length, source.length);
  }
  return source;
}

export default async function(input: ITransformingInfo): Promise<ITransformingInfo> {
  input.info.fragment = _removeVariableAnnotations(input.info.fragment);
  input.info.vertex = _removeVariableAnnotations(input.info.vertex);
  return input;
}
