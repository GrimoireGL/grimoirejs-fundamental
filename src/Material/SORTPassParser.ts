import UniformRegisterer from "./Transformers/UniformRegisterer";
import ITransformingArgument from "./Transformers/ITransformingArgument";
import ITransformer from "./Transformers/ITransformer";
import ISORTPassInfo from "./ISORTPassInfo";

import CommentRemover from "./Transformers/CommentRemover";
import ImportTransformer from "./Transformers/ImportTransformer";
import VariableParser from "./Transformers/VariableParser";
import ShaderSeparator from "./Transformers/ShaderSeparator";
import AttributeVariableRemover from "./Transformers/AttributeVariableRemover";
import VariableAnnotationRemover from "./Transformers/VariableAnnotationRemover";
import PrecisionParser from "./Transformers/PrecisionParser";
import PrecisionComplementer from "./Transformers/PrecisionComplementer";
import BasicGLConfigParser from "./Transformers/BasicGLConfigParser";
import AnnotationRemover from "./Transformers/AnnotationRemover";

export default class SORTPassParser {
  public static transformers: ITransformer[] = [
    CommentRemover,
    ImportTransformer,
    VariableParser("uniform"),
    VariableParser("attribute"),
    BasicGLConfigParser,
    AnnotationRemover,
    ShaderSeparator,
    AttributeVariableRemover,
    VariableAnnotationRemover,
    PrecisionParser,
    PrecisionComplementer,
    UniformRegisterer
  ] as ITransformer[];

  public static async parse(source: string): Promise<ISORTPassInfo> {
    let transformingInfo: ITransformingArgument = {
      origin: source,
      transforming: source,
      info: {
        fragment: "",
        vertex: "",
        uniforms: {},
        attributes: {},
        vertexPrecision: {},
        fragmentPrecision: {},
        configurator: [],
        systemRegisterers: [],
        gomlAttributes: {}
      }
    };
    for (let i = 0; i < SORTPassParser.transformers.length; i++) {
      transformingInfo = await SORTPassParser.transformers[i](transformingInfo);
    }
    return transformingInfo.info;
  }
}
