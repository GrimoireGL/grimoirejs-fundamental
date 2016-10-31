import ITransformingArgument from "./ITransformingArgument";
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

export default async function(input: ITransformingArgument): Promise<ITransformingArgument> {
  input.info.shaderSource = _removeAnnotations(input.info.shaderSource);
  return input;
}
