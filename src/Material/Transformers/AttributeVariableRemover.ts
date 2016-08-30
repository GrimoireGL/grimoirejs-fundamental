import ITransformingInfo from "./ITransformingInfo";
function _removeAttributeVariables(source: string): string {
  const regex = /(\s*attribute\s+[a-zA-Z0-9_]+\s+[a-zA-Z0-9_]+;)/;
  while (true) {
    let found = regex.exec(source);
    if (!found) {
      break;
    }
    source = source.replace(found[0], "");
  }
  return source;
}

export default async function(input: ITransformingInfo): Promise<ITransformingInfo> {
  input.info.fragment = _removeAttributeVariables(input.info.fragment);
  return input;
}
