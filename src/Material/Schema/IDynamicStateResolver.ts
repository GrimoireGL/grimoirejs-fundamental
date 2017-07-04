import Pass from "../Pass";
import IMaterialArgument from "../IMaterialArgument";
interface IDynamicStateResolver {
    (args: string[], pass: Pass): (gl: WebGLRenderingContext, matArgs: IMaterialArgument) => void;
}
export default IDynamicStateResolver;
