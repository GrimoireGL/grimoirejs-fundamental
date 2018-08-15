import header from "raw-loader!../Shaders/header.glsl";
import Geometry from "../Geometry/Geometry";
import GLSLPrecisionChecker from "../Resource/GLSLPrecisionChecker";
import IGLSLPrecision from "../Resource/IGLSLPrecision";
export default class ShaderMixer {
  /**
   * Generate shader code from specified macro and codes.
   * @param  {number}  type   WebGLRenderingContext.VERTEX_SHADER or WebGLRenderingContext.FRAGMENT_SHADER
   * @param   macros macro hash to be included
   * @param  {string}  code   shader body(Raw glsl)
   * @return {string}         generated shader code
   */
  public static generate(type: number, macros: { [key: string]: string }, code: string, geometry: Geometry, extensions: string[], supportedExtensions: string[]): string {
    let shaderTypeMacro;
    if (type === WebGLRenderingContext.VERTEX_SHADER) {
      shaderTypeMacro = "#define VS\n";
    } else {
      shaderTypeMacro = "#define FS\n";
    }
    return `${this._getExtensionCode(extensions, supportedExtensions)}${shaderTypeMacro}${this._precisionCode(geometry.gl)}${ShaderMixer._geometryToAttributeUsedFlags(geometry)}${ShaderMixer._macroCode(macros)}${header}\n/*****BEGINNING OF USER CODE******/\n${code}`;
  }

  private static _macroCode(macros: { [key: string]: string }): string {
    let macroCode = "";
    for (const macroName in macros) {
      if (macros[macroName] === void 0) {
        continue;
      }
      macroCode += `#define ${macroName} ${macros[macroName]}\n`;
    }
    return macroCode;
  }

  private static _getExtensionCode(extensions: string[], supportedExtensions: string[]): string {
    let result = "";
    extensions.forEach(e => result += `#extension GL_${e} : enable\n`);
    supportedExtensions.forEach(e => result += `#define ${e}_ENABLED\n`);
    return result;
  }


  private static _geometryToAttributeUsedFlags(geometry: Geometry): string {
    let macroCode = "";
    for (const attribName in geometry.accessors) {
      macroCode += `#define ATTRIBUTE_${attribName}_ENABLED\n`;
    }
    return macroCode;
  }

  private static _precisionCode(gl: WebGLRenderingContext): string {
    let result = "";
    const prec = GLSLPrecisionChecker.get(gl);
    result += ShaderMixer._precisionChunk(prec.vertexInteger, "VERTEX_INTEGER", false);
    result += ShaderMixer._precisionChunk(prec.fragmentInteger, "FRAGMENT_INTEGER", false);
    result += ShaderMixer._precisionChunk(prec.vertexFloat, "VERTEX_FLOAT", true);
    result += ShaderMixer._precisionChunk(prec.fragmentFloat, "FRAGMENT_FLOAT", true);
    return result;
  }

  private static _precisionChunk(prec: IGLSLPrecision, typeName: string, isFloat: boolean): string {
    return ShaderMixer._precisionForVariable(prec.lowp, typeName + "_LOWP", isFloat) + ShaderMixer._precisionForVariable(prec.mediump, typeName + "_MEDIUMP", isFloat) + ShaderMixer._precisionForVariable(prec.highp, typeName + "_HIGHP", isFloat);
  }

  private static _precisionForVariable(prec: WebGLShaderPrecisionFormat, name: string, isFloat: boolean): string {
    return `#define VARIABLE_MIN_${name} ${prec.rangeMin}\n#define VARIABLE_MAX_${name} ${prec.rangeMax}\n` + (isFloat ? `#define VARIABLE_PRECISION_${name} ${prec.precision} \n` : "");
  }
}
