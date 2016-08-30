import ITransformingInfo from "./Transformers/ITransformingInfo";
import ITransformer from "./Transformers/ITransformer";
import IProgramTransformInfo from "./IProgramTransformInfo";

import RemoveCommentTransformer from "./Transformers/RemoveCommentTransformer";
import ImportResolver from "./ImportResolver";

export default class ProgramTransformer {
  public static transformers: ITransformer[] = [
    RemoveCommentTransformer,
    ImportResolver,
  ] as ITransformer[];

  public static async transform(source: string): Promise<IProgramTransformInfo> {
    let transformingInfo: ITransformingInfo = {
      origin: source,
      transforming: source,
      info: {
        fragment: "",
        vertex: "",
        uniforms: {},
        attributes: {}
      }
    };
    for (let i = 0; i < ProgramTransformer.transformers.length; i++) {
      transformingInfo = await ProgramTransformer.transformers[i](transformingInfo);
    }
    return transformingInfo.info;
  }
}
