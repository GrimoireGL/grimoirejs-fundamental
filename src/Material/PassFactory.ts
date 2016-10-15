import IMaterialArgument from "./IMaterialArgument";
import SORTPassInfoResolver from "./SORTPassInfoResolver";
import ISORTPassInfo from "./ISORTPassInfo";
import SORTPass from "./SORTPass";
import UniformProxy from "../Resource/UniformProxy";
import Program from "../Resource/Program";
import Shader from "../Resource/Shader";
import SORTPassParser from "./SORTPassParser";
export default class PassFactory {

  private static _sortPassResolver: SORTPassInfoResolver = new SORTPassInfoResolver();
  /**
   * [Instanciate SORT pass from ISORTPassInfo]
   * @param  {WebGLRenderingContext} gl       [description]
   * @param  {ISORTPassInfo}         passInfo [description]
   * @return {Promise<SORTPass>}              [description]
   */
  public static fromSORTPassInfo(gl: WebGLRenderingContext, passInfo: ISORTPassInfo): SORTPass {
    const vs = new Shader(gl, WebGLRenderingContext.VERTEX_SHADER, passInfo.vertex);
    const fs = new Shader(gl, WebGLRenderingContext.FRAGMENT_SHADER, passInfo.fragment);
    const program = new Program(gl);
    const tasks = [] as ((p: SORTPass, a: IMaterialArgument) => void)[];
    program.update([vs, fs]);
    tasks.push((p, m) => {
      for (let key in passInfo.gomlAttributes) {
        const registerer = passInfo.gomlAttributes[key].register;
        registerer(p.program.uniforms, m.attributeValues[key], m);
      }
    });

    const attributes: string[] = [];
    for (let key in passInfo.attributes) {
      attributes.push(key);
    }
    const configurators = passInfo.configurator;
    for (let i = 0; i < configurators.length; i++) {
      tasks.push((p) => configurators[i](p.program.gl));
    }
    for (let i = 0; i < passInfo.systemRegisterers.length; i++) {
      tasks.push((p, args) => passInfo.systemRegisterers[i](p.program.uniforms, args));
    }
    return new SORTPass(program, attributes, tasks, passInfo);
  }

  public static async fromSinglePassSORT(gl: WebGLRenderingContext, src: string): Promise<SORTPass> {
    const passInfo = await PassFactory._sortPassResolver.resolve(src, () => SORTPassParser.parse(src));
    return PassFactory.fromSORTPassInfo(gl, passInfo);
  }

  public static passInfoFromSORT(source: string): Promise<ISORTPassInfo[]> {
    const passes = source.split("@Pass").filter(p => p.indexOf("@") >= 0); // Separate with @Pass and if there was some pass without containing @, that would be skipped since that is assumed as empty.
    return Promise.all(passes.map(p => SORTPassParser.parse(p)));
  }
}
