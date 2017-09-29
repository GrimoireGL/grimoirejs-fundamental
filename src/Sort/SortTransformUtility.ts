import IMacro from "../Material/Schema/IMacro";
import IVariableInfo from "../Material/Schema/IVariableInfo";
import IState from "../Material/Schema/IState";
import Preferences from "./Preferences";
import TypeToConstant from "./TypeToConstant";
import NameSemanticPair from "./NameSemanticsPair";
import ImportResolver from "./ImportResolver";
import CommentRemover from "./CommentRemover";

export default class SortTransformUtility {
  /**
   * Separate .sort shader text with @Technique statements.
   * @param  {string} uncommentedSource [description]
   * @return {[type]}                   [description]
   */
  public static separateTechniqueSource(uncommentedSource: string): { [key: string]: string } {
    if (uncommentedSource.indexOf("@Technique") === -1) {
      return { default: uncommentedSource };
    } else {
      const result = {};
      const regex = /@Technique\s+([a-zA-Z0-9_]+)/g;
      let regexResult: RegExpExecArray;
      while (regexResult = regex.exec(uncommentedSource)) {
        const techniqueName = regexResult[1];
        if (result[techniqueName] !== void 0) {
          throw new Error(`Technique name ${techniqueName} is dupelicated`);
        } else {
          result[techniqueName] = SortTransformUtility.obtainNextSection(uncommentedSource, "{", "}", regexResult.index + regexResult.length);
        }
      }
      return result;
    }
  }

  /**
   * Separate technique source with @Pass statement.
   * @param  {string}   uncommentedSource [description]
   * @return {string[]}                   [description]
   */
  public static separatePassSource(uncommentedSource: string): string[] {
    if (uncommentedSource.indexOf("@Pass") === -1) {
      return [uncommentedSource];
    } else {
      const result = [];
      const regex = /@Pass/g;
      let regexResult: RegExpExecArray;
      while (regexResult = regex.exec(uncommentedSource)) {
        result.push(SortTransformUtility.obtainNextSection(uncommentedSource, "{", "}", regexResult.index + regexResult.length));
      }
      return result;
    }
  }

  /**
   * Fetch draw order preference from technique source.
   * @param  {string} uncommentedTechniqueSource [description]
   * @return {string}                            [description]
   */
  public static fetchDrawOrder(uncommentedTechniqueSource: string): string {
    const regexResult = /@DrawOrder\s*\((\w+)\)/g.exec(uncommentedTechniqueSource);
    if (regexResult) {
      const firstPassIndex = uncommentedTechniqueSource.indexOf("@Pass");
      if (firstPassIndex !== -1 && firstPassIndex < regexResult.index) {
        throw new Error("DrawOrder preference should be just under @Technique section");
      }
      return regexResult[1];
    }
    return null;
  }

  public static removePreferences(source: string): string {
    const regex = /@.+$/gm;
    return source.replace(regex, "");
  }

  public static async resolveImports(uncommentedSource: string): Promise<string> {
    while (true) {
      const regexResult = /\s*@import\s+"([^"]+)"/.exec(uncommentedSource);
      if (!regexResult) { break; }
      let importContent: string;
      importContent = await SortTransformUtility.resolveImports(await ImportResolver.resolve(regexResult[1]));
      if (typeof importContent !== "string") {
        throw new Error(`Required shader chunk '${regexResult[1]}' was not found!!`);
      }
      uncommentedSource = uncommentedSource.replace(regexResult[0], `\n${importContent}\n`);
    }
    return uncommentedSource;
  }

  public static parseMacros(source: string): { [key: string]: IMacro } {
    const result = {};
    let regex = /@ExposeMacro\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*,\s*([a-zA-Z0-9_]+)\s*\)/g;
    let regexResult;
    while ((regexResult = regex.exec(source))) {
      if (!regexResult[1] || !regexResult[2] || !regexResult[3] || !regexResult[4]) {
        throw new Error(`Invalid parameter was passed on @ExposeMacro preference on '${regexResult[0]}'`);
      }
      if (regexResult[1] !== "bool" && regexResult[1] !== "int") {
        throw new Error(`Invalid macro type "${regexResult[1]}". regexResult type must be int or bool`);
      }
      let value;
      if (regexResult[1] === "bool") {
        if (regexResult[4] !== "true" && regexResult[4] !== "false") {
          throw new Error(`Default macro value "${regexResult[4]}" is invalid for bool type macro. Must be true or false`);
        }
        value = regexResult[4] === "true";
      } else {
        value = parseFloat(regexResult[4]);
        if (isNaN(value)) {
          throw new Error(`Default macro value "${regexResult[4]}" is invalid for int type macro. Must be a number.`);
        }
      }
      result[regexResult[2]] = <IMacro>{
        name: regexResult[2],
        macroName: regexResult[3],
        type: regexResult[1],
        value: value,
        target: "expose"
      };
    }
    regex = /@ReferMacro\s*\(\s*([a-zA-Z0-9_]+)\s*,\s*(.+)\s*\)/g;
    while ((regexResult = regex.exec(source))) {
      if (!regexResult[1] || !regexResult[2]) {
        throw new Error(`Invalid parameter was passed on @ReferMacro preference on '${regexResult[0]}'`);
      }
      result[regexResult[1]] = <IMacro>{
        name: regexResult[1],
        macroName: regexResult[1],
        value: regexResult[2],
        target: "refer"
      };
    }
    return result;
  }

  public static parsePreferences(source: string): IState {
    const result: IState = {
      enable: [WebGLRenderingContext.CULL_FACE, WebGLRenderingContext.BLEND, WebGLRenderingContext.DEPTH_TEST],
      functions: {
        blendColor: [0, 0, 0, 0],
        cullFace: [WebGLRenderingContext.BACK],
        blendFuncSeparate: [WebGLRenderingContext.ONE, WebGLRenderingContext.ZERO, WebGLRenderingContext.ONE, WebGLRenderingContext.ZERO],
        blendEquationSeparate: [WebGLRenderingContext.FUNC_ADD, WebGLRenderingContext.FUNC_ADD],
        lineWidth: [1],
        frontFace: [WebGLRenderingContext.CCW],
        depthRange: [0, 1],
        depthFunc: [WebGLRenderingContext.LESS]
      },
      dynamicState: []
    };
    const regex = /@([A-Za-z]+)\(([\sa-zA-Z_0-9,\.\-]*)\)/g;
    let regexResult;
    while ((regexResult = regex.exec(source))) {
      const prefParser = Preferences[regexResult[1]];
      if (!prefParser) {
        throw new Error(`Unknown pass preference ${regexResult[1]} was specified.`);
      }
      prefParser(result, regexResult[2].split(",").map(m => m.trim()));
    }
    return result;
  }

  public static asValidJSON(json: string): string {
    const regex = /([\{,]\s*)([a-zA-Z0-9_]+)(\s*\:)/gm;
    let result = json.replace(regex, '$1"$2"$3');
    return result;
  }

  public static removeComment(source: string): string {
    return CommentRemover.remove(source);
  }

  public static obtainNextSection(source: string, begin: string, end: string, offset: number): string {
    const beginningPosition = source.indexOf(begin, offset);
    if (beginningPosition === -1) {
      throw new Error(`Begining section charactor '${begin}' was not found.`);
    }
    if (begin.length > 1 || end.length > 1) {
      throw new Error("Invalid parameter");
    }
    let matchingCount = 1;
    const beginCode = begin.charCodeAt(0);
    const endCode = end.charCodeAt(0);
    for (let i = beginningPosition + 1; i < source.length; i++) {
      const current = source.charCodeAt(i);
      if (current === beginCode) {
        matchingCount++;
      } else if (current === endCode) {
        matchingCount--;
      }
      if (matchingCount === 0) {
        return source.substring(beginningPosition + 1, i);
      }
    }
    throw new Error(`Invalid bracket matching`);
  }

  public static generateVariableFetchRegex(variableType: string): RegExp {
    return new RegExp(`(?:@([a-zA-Z0-9_]+)?(\\{.+\\})?)?\\s*${variableType}\\s+(?:(lowp|mediump|highp)\\s+)?([a-z0-9A-Z]+)\\s+([a-zA-Z0-9_]+)(?:\\s*\\[\\s*([a-zA-Z0-9_]+)\\s*\\]\\s*)?\\s*;`, "g");
  }

  public static parseVariables(source: string, variableType: string): { [key: string]: IVariableInfo } {
    const result = {};
    const regex = SortTransformUtility.generateVariableFetchRegex(variableType);
    let regexResult: RegExpExecArray;
    while ((regexResult = regex.exec(source))) {
      let name = regexResult[5];
      let type = TypeToConstant[regexResult[4]];
      let precision = regexResult[3];
      let rawAnnotations = regexResult[2];
      let isArray = regexResult[6] !== void 0;
      let arrayCount = undefined;
      let semantic = regexResult[1];
      if (!semantic) {
        semantic = NameSemanticPair[variableType][name];
        if (!semantic) {
          semantic = variableType === "uniform" ? "USER_VALUE" : name.toUpperCase();
        }
      }
      if (isArray) {
        arrayCount = parseInt(regexResult[6], 10);
        if (isNaN(arrayCount)) {
          arrayCount = regexResult[6];
        }
      }
      result[name] = <IVariableInfo>{
        semantic: semantic,
        name: name,
        type: type,
        precision: precision,
        attributes: rawAnnotations ? JSON.parse(SortTransformUtility.asValidJSON(rawAnnotations)) : {},
        isArray: isArray,
        count: arrayCount
      };
    }
    return result;
  }
}
