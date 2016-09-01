import {Vector2, Vector3, Vector4} from "grimoirejs-math";
import IMaterialArgument from "../IMaterialArgument";
import UniformProxy from "../../Resource/UniformProxy";
import UniformValueResolver from "../UniformValueResolver";
import ITransformingInfo from "./ITransformingInfo";

async function _registerUserAttributes(input: ITransformingInfo): Promise<void> {
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
      case "vec2":
        attributes[variableName] = {
          converter: "vector2",
          defaultValue: "0,0",
          register: (proxy, val) => {
            proxy.uniformVector2(variableName, val as Vector2);
          }
        };
        break;
      case "vec3":
        attributes[variableName] = {
          converter: "vector3",
          defaultValue: "0,0,0",
          register: (proxy, val) => {
            proxy.uniformVector3(variableName, val as Vector3);
          }
        };
        break;
      case "vec4":
        attributes[variableName] = {
          converter: "vector4",
          defaultValue: "0,0,0,0",
          register: (proxy, val) => {
            proxy.uniformVector4(variableName, val as Vector4);
          }
        };
        break;
      default:
        throw new Error("Unsupported type was found");
    }
  }
  await Promise.all(promises);
}

/**
 * Register system shader variables whose name starts with _.
 * @param  {ITransformingInfo} input [description]
 * @return {Promise<void>}           [description]
 */
async function _registerSystemAttributes(input: ITransformingInfo): Promise<void> {
  const registerers = input.info.systemRegisterers;
  const promises: Promise<((proxy: UniformProxy, args: IMaterialArgument) => void)>[] = [];
  for (let variableName in input.info.uniforms) {
    if (variableName.charAt(0) === "_") {
      const variableInfo = input.info.uniforms[variableName];
      const resolver = UniformValueResolver.resolve(variableName, variableInfo);
      promises.push(resolver);
    }
  }
  const resolved = await Promise.all(promises);
  resolved.forEach((r) => {
    if (r) {
      registerers.push(r);
    }
  });
}

export default async function(input: ITransformingInfo): Promise<ITransformingInfo> {
  await _registerUserAttributes(input);
  await _registerSystemAttributes(input);
  return input;
}
