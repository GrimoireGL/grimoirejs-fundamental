import UniformRegisterer from "./Transformers/UniformRegisterer";
import ITransformingInfo from "./Transformers/ITransformingInfo";
import ITransformer from "./Transformers/ITransformer";
import IProgramTransformInfo from "./IProgramTransformInfo";

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

export default class ProgramTransformer {
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

  public static async transform(source: string): Promise<IProgramTransformInfo> {
    let transformingInfo: ITransformingInfo = {
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
    for (let i = 0; i < ProgramTransformer.transformers.length; i++) {
      transformingInfo = await ProgramTransformer.transformers[i](transformingInfo);
    }
    return transformingInfo.info;
  }
}
