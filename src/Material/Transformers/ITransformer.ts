import ITransforimingInfo from "./ITransformingArgument";
interface ITransformer {
  (transformArg: ITransforimingInfo): Promise<ITransforimingInfo>;
}

export default ITransformer;
