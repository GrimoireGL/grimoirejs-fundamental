import Texture2D from "../../Resource/Texture2D";
import IVariableInfo from "../IVariableInfo";
import IMaterialAttributeDeclaration from "../IMaterialAttributeDeclaration";
import {Vector2, Vector3, Vector4, Color3, Color4} from "grimoirejs-math";
import IMaterialArgument from "../IMaterialArgument";
import UniformProxy from "../../Resource/UniformProxy";
import EnvUniformValueResolver from "../EnvUniformValueResolver";
import ITransformingArgument from "./ITransformingArgument";

function _getDecl(converter: string, defaultValue: any, register: (proxy: UniformProxy, val: any, matInfo: IMaterialArgument) => void): IMaterialAttributeDeclaration {
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

async function _registerUserUniforms(input: ITransformingArgument): Promise<void> {
  const promises: Promise<void>[] = [];
  const attributes = input.info.gomlAttributes;
  for (let variableName in input.info.uniforms) {
    if (variableName.charAt(0) === "_") {
      // this should not assigned by material argument
      continue;
    }
    const variableInfo = input.info.uniforms[variableName];
    const annotations = variableInfo.variableAnnotation;
    if (variableInfo.isArray) {
      switch (variableInfo.variableType) {
        case "float":
          let defaultArray = new Array(variableInfo.arrayLength) as number[];
          defaultArray = defaultArray.map((p) => 0);
          attributes[variableName] = _getDecl("numberarray", _resolveDefault(variableInfo, defaultArray), (proxy, val) => {
            proxy.uniformFloatArray(variableName, val);
          });
          break;
        default:
          throw new Error(`Unsupported array type ${variableInfo.variableType}`);
      }
    } else {
      switch (variableInfo.variableType) {
        case "bool":
          attributes[variableName] = _getDecl("boolean", _resolveDefault(variableInfo, false), (proxy, val) => {
            proxy.uniformBool(variableName, val);
          });
          break;
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
          attributes[variableName] = _getDecl("materialtexture", _resolveDefault(variableInfo, undefined), (proxy, val, matArgs) => {
            if (val) {
              proxy.uniformTexture2D(variableName, val(matArgs.buffers) as Texture2D);
            } else {
              throw new Error(`The material require a texture(${variableName}) as argument. But there was no texture specified`);
            }
          });
          break;
        default:
          throw new Error("Unsupported type was found");
      }
    }
  }
  await Promise.all(promises);
}

/**
 * Register system shader variables whose name starts with _.
 * @param  {ITransformingArgument} input [description]
 * @return {Promise<void>}           [description]
 */
function _registerEnvUniforms(input: ITransformingArgument): void {
  const registerers = input.info.systemRegisterers;
  for (let variableName in input.info.uniforms) {
    if (variableName.charAt(0) === "_") {
      const variableInfo = input.info.uniforms[variableName];
      let resolver = EnvUniformValueResolver.resolve(variableName, variableInfo);
      if (resolver) {
        registerers.push(resolver);
        continue;
      }
      throw new Error(`Unknown environment uniform variable ${variableName}`);
    }
  }
}

export default async function(input: ITransformingArgument): Promise<ITransformingArgument> {
  await _registerUserUniforms(input);
  _registerEnvUniforms(input);
  return input;
}
