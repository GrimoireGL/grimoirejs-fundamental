import SORTPass from "./SORTPass";
import UniformProxy from "../Resource/UniformProxy";
import Program from "../Resource/Program";
import Shader from "../Resource/Shader";
import Pass from "./Pass";
import SORTPassParser from "./SORTPassParser";
export default class PassFactory {

  public static async fromSORT(gl: WebGLRenderingContext, src: string): Promise<Pass> {
    const passInfo = await SORTPassParser.parse(src);
    const vs = new Shader(gl, WebGLRenderingContext.VERTEX_SHADER, passInfo.vertex);
    const fs = new Shader(gl, WebGLRenderingContext.FRAGMENT_SHADER, passInfo.fragment);
    const program = new Program(gl);
    program.update([vs, fs]);
    const registerers: ((proxy: UniformProxy, values: { [key: string]: any }) => void)[] = [];
    for (let key in passInfo.gomlAttributes) {
      registerers.push((p, v) => passInfo.gomlAttributes[key].register(p, v[key]));
    }
    const attributes: string[] = [];
    for (let key in passInfo.attributes) {
      attributes.push(key);
    }
    return new SORTPass(program, attributes, (p, args) => {
      passInfo.configurator.forEach((configurator) => configurator(p.gl)); // gl configuration
      registerers.forEach((r) => r(p.uniforms, args.attributeValues)); // user variables
      passInfo.systemRegisterers.forEach((r) => r(p.uniforms, args)); // system variables
    }, passInfo);
  }
}
