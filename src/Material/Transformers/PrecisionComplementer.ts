import ITransformingInfo from "./ITransformingInfo";

function _addPrecision(source: string, targetType: string, precision: string): string {
  return `precision ${precision} ${targetType};\n` + source;
}

export default async function(input: ITransformingInfo): Promise<ITransformingInfo> {
  if (!input.info.fragmentPrecision["float"]) {// When precision of float in fragment shader was not declared,precision mediump float need to be inserted.
    input.info.fragment = _addPrecision(input.info.fragment, "float", "mediump");
    input.info.fragmentPrecision["float"] = "mediump";
  }
  return input;
}
