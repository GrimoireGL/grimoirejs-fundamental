import IPassRecipe from "../Material/IPassRecipe";
import SortTransformUtility from "./SortTransformUtility";
import ITechniqueRecipe from "../Material/ITechniqueRecipe";
class SortParser {
  /**
   * Cache to prevent double loading
   */
  private static _parsedCache: { [key: number]: { [key: string]: ITechniqueRecipe } } = {};

  public static parse(source: string): Promise<{ [key: string]: ITechniqueRecipe }> {
    const sourceHash = SortParser._getHash(source);
    if (SortParser._parsedCache[sourceHash] !== void 0) { // When specified source was loaded already
      return new Promise((resolve, reject) => {
        resolve(SortParser._parsedCache[sourceHash]);
      });
    } else {
      return SortParser._parse(source).then(v => {
        SortParser._parsedCache[sourceHash] = v;
        return v;
      });
    }
  }

  private static _parse(source: string): Promise<{ [key: string]: ITechniqueRecipe }> {
    return new Promise((resolve, reject) => {
      const result: { [key: string]: ITechniqueRecipe; } = {};
      SortTransformUtility.resolveImports(SortTransformUtility.removeComment(source)).then(uncommented => {
        try {
          const techniqueSources = SortTransformUtility.separateTechniqueSource(uncommented);
          for (let key in techniqueSources) {
            result[key] = SortParser._parseTechnique(techniqueSources[key]);
          }
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  private static _parseTechnique(techniqueSource: string): ITechniqueRecipe {
    const drawOrder = SortTransformUtility.fetchDrawOrder(techniqueSource) || "Auto";
    const passSources = SortTransformUtility.separatePassSource(techniqueSource);
    const passes: IPassRecipe[] = new Array(passSources.length);
    for (let i = 0; i < passSources.length; i++) {
      passes[i] = SortParser._parsePassSource(passSources[i]);
    }
    return {
      drawOrder: drawOrder,
      passes: passes
    };
  }

  private static _parsePassSource(passSource: string): IPassRecipe {
    const shaderSource = SortTransformUtility.removePreferences(passSource);
    const attributes = SortTransformUtility.parseVariables(passSource, "attribute");
    const uniforms = SortTransformUtility.parseVariables(passSource, "uniform");
    const macros = SortTransformUtility.parseMacros(passSource);
    const states = SortTransformUtility.parsePreferences(passSource);
    return <IPassRecipe>{
      fragment: shaderSource,
      vertex: shaderSource,
      attributes: attributes,
      uniforms: uniforms,
      macros: macros,
      states: states
    };
  }

  private static _getHash(source: string): number {
    let hash = 0, i, chr, len;
    if (source.length === 0) return hash;
    for (i = 0, len = this.length; i < len; i++) {
      chr = source.charCodeAt(i);
      hash = ((hash << 5) - hash) + chr;
      hash |= 0;
    }
    return hash;
  }
}

export default SortParser;