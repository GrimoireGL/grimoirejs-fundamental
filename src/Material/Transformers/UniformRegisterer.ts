import ITransformingInfo from "./ITransformingInfo";
export default async function(input: ITransformingInfo): Promise<ITransformingInfo> {
  const promises: Promise<void>[] = [];
  const attributes = input.info.gomlAttributes;
  for (let variableName in input.info.uniforms) {
    if (variableName.charAt(0) === "_") {
      // this should not assigned by material argument
      continue;
    }
    const variableInfo = input.info.uniforms[variableName];
    switch (variableInfo.variableType) {
      case "float":
        attributes[variableName] = {
          converter: "number",
          defaultValue: 0,
          register: (proxy, val) => {
            proxy.uniformFloat(variableName, val as number);
          }
        };

        break;
      default:
        throw new Error("Unsupported type was found");
    }
  }
  await Promise.all(promises);
  return input;
}
