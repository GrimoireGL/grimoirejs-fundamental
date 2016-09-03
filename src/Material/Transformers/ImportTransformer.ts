import ITransformingArgument from "./ITransformingArgument";
import ImportResolver from "../ImportResolver";
async function _parseImport(source: string): Promise<string> {
  while (true) {
    const regexResult = /\s*@import\s+"([^"]+)"/.exec(source);
    if (!regexResult) { break; }
    let importContent: string;
    importContent = await _parseImport(await ImportResolver.resolve(regexResult[1]));
    if (!importContent) {
      throw new Error(`Required shader chunk '${regexResult[1]}' was not found!!`);
    }
    source = source.replace(regexResult[0], `\n${importContent}\n`);
  }
  return source;
}

export default async function(input: ITransformingArgument): Promise<ITransformingArgument> {
  const transformed = await _parseImport(input.transforming);
  input.transforming = transformed;
  return input;
}
