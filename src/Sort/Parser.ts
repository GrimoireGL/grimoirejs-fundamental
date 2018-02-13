import IPassRecipe from "../Material/Schema/IPassRecipe";
import ITechniqueRecipe from "../Material/Schema/ITechniqueRecipe";
import HashCalculator from "../Util/HashCalculator";
import SortTransformUtility from "./SortTransformUtility";
class SortParser {
  /**
   * Cache to prevent double loading
   */
  private static _parsedCache: { [key: number]: { [key: string]: ITechniqueRecipe } } = {};

  public static parse(source: string): Promise<{ [key: string]: ITechniqueRecipe }> {
    const sourceHash = HashCalculator.calcHash(source);
    if (SortParser._parsedCache[sourceHash] !== void 0) { // When specified source was loaded already
      return new Promise((resolve, reject) => {
        resolve(SortParser._parsedCache[sourceHash]);
      });
    } else {
      return SortParser._parse(source).then(v => {
        SortParser._parsedCache[source] = v;
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
          for (const key in techniqueSources) {
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
      drawOrder,
      passes,
    };
  }

  private static _parsePassSource(passSource: string): IPassRecipe {
    const shaderSource = SortTransformUtility.removePreferences(passSource);
    const extensions = SortTransformUtility.parseExtensions(passSource);
    const attributes = SortTransformUtility.parseVariables(passSource, "attribute");
    const uniforms = SortTransformUtility.parseVariables(passSource, "uniform");
    const macros = SortTransformUtility.parseMacros(passSource);
    const states = SortTransformUtility.parsePreferences(passSource);
    return {
      extensions,
      fragment: shaderSource,
      vertex: shaderSource,
      attributes,
      uniforms,
      macros,
      states,
    } as IPassRecipe;
  }
}

export default SortParser;
