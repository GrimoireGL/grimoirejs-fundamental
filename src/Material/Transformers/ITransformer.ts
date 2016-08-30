import ITransforimingInfo from "./ITransformingInfo";
interface ITransformer {
  (transformArg: ITransforimingInfo): Promise<ITransforimingInfo>;
}

export default ITransformer;
