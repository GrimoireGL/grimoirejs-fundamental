import ITransformingArgument from "./ITransformingArgument";

function _obtainPrecisions(source: string): { [key: string]: string } {
  const regex = /\s*precision\s+([a-z]+)\s+([a-z0-9]+)/g;
  let result: { [key: string]: string } = {};
  while (true) {
    const found = regex.exec(source);
    if (!found) {
      break;
    }
    result[found[2]] = found[1];
  }
  return result;
}

export default async function(input: ITransformingArgument): Promise<ITransformingArgument> {
  input.info.fragmentPrecision = _obtainPrecisions(input.info.fragment);
  input.info.vertexPrecision = _obtainPrecisions(input.info.vertex);
  return input;
}
