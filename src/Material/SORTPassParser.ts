import UniformRegisterer from "./Transformers/UniformRegisterer";
import ITransformingArgument from "./Transformers/ITransformingArgument";
import ITransformer from "./Transformers/ITransformer";
import ISORTPassInfo from "./ISORTPassInfo";
import CommentRemover from "./Transformers/CommentRemover";
import ImportTransformer from "./Transformers/ImportTransformer";
import VariableParser from "./Transformers/VariableParser";
import VariableAnnotationRemover from "./Transformers/VariableAnnotationRemover";
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
    VariableAnnotationRemover,
    UniformRegisterer
  ] as ITransformer[];

  public static async parse(source: string): Promise<ISORTPassInfo> {
    let transformingInfo: ITransformingArgument = {
      origin: source,
      info: {
        shaderSource: source,
        uniforms: {},
        attributes: {},
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
