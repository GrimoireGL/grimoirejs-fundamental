import UniformRegisterer from "./UniformRegisterer";
import ITransformingArgument from "./ITransformingArgument";
import ITransformer from "./ITransformer";
import ISORTPassInfo from "./Interfaces/ISORTPassInfo";
import CommentRemover from "./CommentRemover";
import ImportTransformer from "./ImportTransformer";
import VariableParser from "./VariableParser";
import VariableAnnotationRemover from "./VariableAnnotationRemover";
import BasicGLConfigParser from "./BasicGLConfigParser";
import AnnotationRemover from "./AnnotationRemover";

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
