import ITransformingArgument from "./ITransformingArgument";

function _removeComment(source: string): string {
  let text: string = "";
  let isLineComment = false;
  let isMultiLineComment = false;
  for (let i = 0; i < source.length; i++) {
    const c = source.charAt(i);
    if (c === "/") {
      if (i + 1 < source.length) {
        if (source.charAt(i + 1) === "/" && !isMultiLineComment) {
          isLineComment = true;
          i++;
          continue;
        } else if (source.charAt(i + 1) === "*" && !isLineComment) {
          isMultiLineComment = true;
          i++;
          continue;
        }
      }
    }
    if (c === "*" && isMultiLineComment && (i + 1 < source.length) && source.charAt(i + 1) === "/") {
      isMultiLineComment = false;
      i++;
      continue;
    }
    if (c === "\n" && isLineComment) {
      isLineComment = false;
      continue;
    }
    if (!isLineComment && !isMultiLineComment) {
      text += c;
    }
  }
  return text;
}

export default async function(input: ITransformingArgument): Promise<ITransformingArgument> {
  input.transforming = _removeComment(input.transforming);
  return input;
}
