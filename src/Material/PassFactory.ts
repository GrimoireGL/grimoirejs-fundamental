import GLSLXPass from "./GLSLXPass";
import UniformProxy from "../Resource/UniformProxy";
import Program from "../Resource/Program";
import Shader from "../Resource/Shader";
import Pass from "./Pass";
import ProgramTransformer from "./ProgramTransformer";
export default class PassFactory {
  public static async fromGLSLX(gl: WebGLRenderingContext, src: string): Promise<Pass> {
    const passInfo = await ProgramTransformer.transform(src);
    const vs = new Shader(gl, WebGLRenderingContext.VERTEX_SHADER, passInfo.vertex);
    const fs = new Shader(gl, WebGLRenderingContext.FRAGMENT_SHADER, passInfo.fragment);
    const program = new Program(gl);
    program.update([vs, fs]);
    const registerers: ((proxy: UniformProxy, values: { [key: string]: any }) => void)[] = [];
    for (let key in passInfo.gomlAttributes) {
      registerers.push((p, v) => passInfo.gomlAttributes[key].register(p, v[key]));
    }
    return new GLSLXPass(program, (p, args) => {
      passInfo.configurator.forEach((configurator) => configurator(p.gl));
      registerers.forEach((r) => r(p.uniforms, args.attributeValues));
    }, passInfo);
  }
}
