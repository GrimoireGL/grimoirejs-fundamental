import ITransformingInfo from "./ITransformingInfo";
function _removeAnnotations(source: string): string {
  const regex = /(\s*@[a-zA-Z]*\([^)]*\))/;
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
  input.transforming = _removeAnnotations(input.transforming);
  return input;
}
