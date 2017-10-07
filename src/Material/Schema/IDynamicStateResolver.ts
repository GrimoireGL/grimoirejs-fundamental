import IMaterialArgument from "../IMaterialArgument";
import Pass from "../Pass";
interface IDynamicStateResolver {
    (args: string[], pass: Pass): (gl: WebGLRenderingContext, matArgs: IMaterialArgument) => void;
}
export default IDynamicStateResolver;
