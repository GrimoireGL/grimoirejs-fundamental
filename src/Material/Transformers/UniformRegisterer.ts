import GLSLUtil from "./GLSLUtil";
import Texture2D from "../../Resource/Texture2D";
import IVariableInfo from "./Interfaces/IVariableInfo";
import IMaterialAttributeDeclaration from "./Interfaces/IMaterialAttributeDeclaration";
import {Vector2, Vector3, Vector4, Color3, Color4} from "grimoirejs-math";
import IMaterialArgument from "../IMaterialArgument";
import UniformProxy from "../../Resource/UniformProxy";
import EnvUniformValueResolver from "../EnvUniformValueResolver";
import ITransformingArgument from "./ITransformingArgument";

function _getDecl(converter: string, defaultValue: any, register: (proxy: UniformProxy, matInfo: IMaterialArgument) => void): IMaterialAttributeDeclaration {
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
    const valName = variableName;
    const uniforms = input.info.uniforms;
    const variableInfo = uniforms[variableName];
    const annotations = variableInfo.variableAnnotation;
    if (GLSLUtil.isPrimitive(variableInfo.variableType)) {
      if (variableInfo.isArray) {
        switch (variableInfo.variableType) {
          case "float":
            let defaultArray = new Array() as number[];
            defaultArray = defaultArray.map((p) => 0);
            attributes[valName] = _getDecl("NumberArray", _resolveDefault(variableInfo, defaultArray), (proxy, matArg) => {
              proxy.uniformFloatArray(valName, matArg.attributeValues[valName]);
            });
            break;
          default:
            throw new Error(`Unsupported array type ${variableInfo.variableType}`);
        }
      } else {
        switch (variableInfo.variableType) {
          case "bool":
            attributes[valName] = _getDecl("Boolean", _resolveDefault(variableInfo, false), (proxy, matArg) => {
              proxy.uniformBool(valName, matArg.attributeValues[valName]);
            });
            break;
          case "float":
            attributes[valName] = _getDecl("Number", _resolveDefault(variableInfo, 0), (proxy, matArg) => {
              proxy.uniformFloat(valName, matArg.attributeValues[valName] as number);
            });
            break;
          case "vec2":
            attributes[valName] = _getDecl("Vector2", _resolveDefault(variableInfo, "0,0"), (proxy, matArg) => {
              proxy.uniformVector2(valName, matArg.attributeValues[valName] as Vector2);
            });
            break;
          case "vec3":
            if (annotations["type"] === "color") {
              attributes[valName] = _getDecl("Color3", _resolveDefault(variableInfo, "#000"), (proxy, matArg) => {
                proxy.uniformColor3(valName, matArg.attributeValues[valName] as Color3);
              });
            } else {
              attributes[valName] = _getDecl("Vector3", _resolveDefault(variableInfo, "0,0,0"), (proxy, matArg) => {
                proxy.uniformVector3(valName, matArg.attributeValues[valName] as Vector3);
              });
            }
            break;
          case "vec4":
            if (annotations["type"] === "color") {
              attributes[valName] = _getDecl("Color4", _resolveDefault(variableInfo, "#0000"), (proxy, matArg) => {
                proxy.uniformColor4(valName, matArg.attributeValues[valName] as Color4);
              });
            } else {
              attributes[valName] = _getDecl("Vector4", _resolveDefault(variableInfo, "0,0,0,0"), (proxy, matArg) => {
                proxy.uniformVector4(valName, matArg.attributeValues[valName] as Vector4);
              });
            }
            break;
          case "sampler2D":
            let flagAssignTo: string = undefined;
            // check used flag is existing
            if (annotations["usedFlag"]) {
              if (annotations["usedFlag"] !== void 0) {
                flagAssignTo = annotations["usedFlag"];
              }
            }
            attributes[valName] = _getDecl("MaterialTexture", _resolveDefault(variableInfo, undefined), (proxy, matArgs) => {
              let texture;
              if (matArgs.attributeValues[valName] && (texture = matArgs.attributeValues[valName](matArgs.buffers))) {
                proxy.uniformTexture2D(valName, texture as Texture2D);
                if (flagAssignTo) {
                  proxy.uniformBool(flagAssignTo, true);
                }
              } else {
                proxy.uniformTexture2D(valName, matArgs.defaultTexture);
                if (flagAssignTo) {
                  proxy.uniformBool(flagAssignTo, false);
                }
              }
            });
            break;
          default:
            throw new Error("Unsupported type was found");
        }
      }
    } else {
      debugger;
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
    }
  }
}

export default async function(input: ITransformingArgument): Promise<ITransformingArgument> {
  await _registerUserUniforms(input);
  _registerEnvUniforms(input);
  return input;
}
