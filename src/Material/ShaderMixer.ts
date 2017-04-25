import header from "raw-loader!./Static/header.glsl";
export default class ShaderMixer {
  /**
   * Generate shader code from specified macro and codes.
   * @param  {number}  type   WebGLRenderingContext.VERTEX_SHADER or WebGLRenderingContext.FRAGMENT_SHADER
   * @param   macros macro hash to be included
   * @param  {string}  code   shader body(Raw glsl)
   * @return {string}         generated shader code
   */
  public static generate(type: number, macros: {[key: string]: string}, code: string): string {
    let shaderTypeMacro;
    if (type === WebGLRenderingContext.VERTEX_SHADER) {
      shaderTypeMacro = "#define VS\n";
    }else {
      shaderTypeMacro = "#define FS\n";
    }
    return `${shaderTypeMacro}${ShaderMixer._macroCode(macros)}${header}\n/*****BEGINNING OF USER CODE******/\n${code}`;
  }

  private static _macroCode(macros: {[key: string]: string}): string {
    let macroCode = "";
    for (let macroName in macros) {
      macroCode += `#define ${macroName} ${macros[macroName]}\n`;
    }
    return macroCode;
  }
}
