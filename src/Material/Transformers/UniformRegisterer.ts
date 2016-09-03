import Texture2D from "../../Resource/Texture2D";
import IVariableInfo from "../IVariableInfo";
import IMaterialAttributeDeclaration from "../IMaterialAttributeDeclaration";
import {Vector2, Vector3, Vector4, Color3, Color4} from "grimoirejs-math";
import IMaterialArgument from "../IMaterialArgument";
import UniformProxy from "../../Resource/UniformProxy";
import UniformValueResolver from "../UniformValueResolver";
import ITransformingArgument from "./ITransformingArgument";

function _getDecl(converter: string, defaultValue: any, register: (proxy: UniformProxy, val: any) => void): IMaterialAttributeDeclaration {
  return {
    converter: converter,
    defaultValue: defaultValue,
    register: register
  };
}

// return default value if annotation containing default value. if not, return provided default value.
function _resolveDefault(vi: IVariableInfo, defaultValue: string | any): string | any {
  if (vi.variableAnnotation.default) {
    return vi.variableAnnotation.default;
  } else {
    return defaultValue;
  }
}

async function _registerUserAttributes(input: ITransformingArgument): Promise<void> {
  const promises: Promise<void>[] = [];
  const attributes = input.info.gomlAttributes;
  for (let variableName in input.info.uniforms) {
    if (variableName.charAt(0) === "_") {
      // this should not assigned by material argument
      continue;
    }
    const variableInfo = input.info.uniforms[variableName];
    const annotations = variableInfo.variableAnnotation;
    switch (variableInfo.variableType) {
      case "float":
        attributes[variableName] = _getDecl("number", _resolveDefault(variableInfo, 0), (proxy, val) => {
          proxy.uniformFloat(variableName, val as number);
        });
        break;
      case "vec2":
        attributes[variableName] = _getDecl("vector2", _resolveDefault(variableInfo, "0,0"), (proxy, val) => {
          proxy.uniformVector2(variableName, val as Vector2);
        });
        break;
      case "vec3":
        if (annotations["type"] === "color") {
          attributes[variableName] = _getDecl("color3", _resolveDefault(variableInfo, "#000"), (proxy, val) => {
            proxy.uniformColor3(variableName, val as Color3);
          });
        } else {
          attributes[variableName] = _getDecl("vector3", _resolveDefault(variableInfo, "0,0,0"), (proxy, val) => {
            proxy.uniformVector3(variableName, val as Vector3);
          });
        }
        break;
      case "vec4":
        if (annotations["type"] === "color") {
          attributes[variableName] = _getDecl("color4", _resolveDefault(variableInfo, "#0000"), (proxy, val) => {
            proxy.uniformColor4(variableName, val as Color4);
          });
        } else {
          attributes[variableName] = _getDecl("vector4", _resolveDefault(variableInfo, "0,0,0,0"), (proxy, val) => {
            proxy.uniformVector4(variableName, val as Vector4);
          });
        }
        break;
      case "sampler2D":
        attributes[variableName] = _getDecl("texture2D", _resolveDefault(variableInfo, undefined), (proxy, val) => {
          proxy.uniformTexture2D(variableName, val as Texture2D);
        });
        break;
      default:
        throw new Error("Unsupported type was found");
    }
  }
  await Promise.all(promises);
}

/**
 * Register system shader variables whose name starts with _.
 * @param  {ITransformingArgument} input [description]
 * @return {Promise<void>}           [description]
 */
async function _registerSystemAttributes(input: ITransformingArgument): Promise<void> {
  const registerers = input.info.systemRegisterers;
  const promises: Promise<((proxy: UniformProxy, args: IMaterialArgument) => void)>[] = [];
  for (let variableName in input.info.uniforms) {
    if (variableName.charAt(0) === "_") {
      const variableInfo = input.info.uniforms[variableName];
      const resolver = UniformValueResolver.resolve(variableName, variableInfo);
      if (resolver) {
        promises.push(resolver);
      } else {
        if (variableInfo.variableType === "sampler2D" && variableInfo.variableAnnotation["type"] === "backbuffer") {
          registerers.push((proxy, mat) => {
            proxy.uniformTexture2D(variableName, mat.buffers[variableInfo.variableAnnotation["name"]]);
          });
        }
      }
    }
  }
  const resolved = await Promise.all(promises);
  resolved.forEach((r) => {
    if (r) {
      registerers.push(r);
    }
  });
}

export default async function(input: ITransformingArgument): Promise<ITransformingArgument> {
  await _registerUserAttributes(input);
  await _registerSystemAttributes(input);
  return input;
}
