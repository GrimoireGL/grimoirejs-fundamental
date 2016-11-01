import MaterialFactory from "./MaterialFactory";
import IMaterialArgument from "./IMaterialArgument";
import ISORTPassInfo from "./Transformers/Interfaces/ISORTPassInfo";
import SORTPass from "./SORTPass";
import UniformProxy from "../Resource/UniformProxy";
import Program from "../Resource/Program";
import Shader from "../Resource/Shader";
import SORTPassParser from "./Transformers/SORTPassParser";
import MacroRegistory from "./MacroRegistory";

export default class PassFactory {
  /**
   * [Instanciate SORT pass from ISORTPassInfo]
   * @param  {WebGLRenderingContext} gl       [description]
   * @param  {ISORTPassInfo}         passInfo [description]
   * @return {Promise<SORTPass>}              [description]
   */
  public static fromSORTPassInfo(factory: MaterialFactory, passInfo: ISORTPassInfo): SORTPass {
    const gl = factory.gl;
    const vs = new Shader(gl, WebGLRenderingContext.VERTEX_SHADER);
    const fs = new Shader(gl, WebGLRenderingContext.FRAGMENT_SHADER);
    const program = new Program(gl);
    const tasks = [] as ((p: SORTPass, a: IMaterialArgument) => void)[];
    factory.macro.addObserver(() => {
      PassFactory._updateShaderCode(factory, passInfo, vs, fs, program);
    });
    PassFactory._updateShaderCode(factory, passInfo, vs, fs, program);
    const attributes = PassFactory._getAttributeNames(passInfo);
    PassFactory._appendUserVariableRegistration(tasks, passInfo);
    PassFactory._appendSystemVariableRegistration(tasks, passInfo);
    PassFactory._appendGLConfigurators(tasks, passInfo);
    return new SORTPass(program, attributes, tasks, passInfo);
  }

  public static passInfoFromSORT(source: string): Promise<ISORTPassInfo[]> { // TODO should notify warning if there was some of code above of @Pass
    let splitted = source.split("@Pass");
    splitted.splice(0, 1);// Separate with @Pass and if there was some pass without containing @, that would be skipped since that is assumed as empty.
    return Promise.all(splitted.map(p => SORTPassParser.parse(p)));
  }

  private static _updateShaderCode(factory: MaterialFactory, passInfo: ISORTPassInfo, vs: Shader, fs: Shader, p: Program): void {
    vs.update(PassFactory._getShaderSource("VS", factory, passInfo.shaderSource));
    fs.update(PassFactory._getShaderSource("FS", factory, passInfo.shaderSource));
    p.update([vs, fs]);
  }

  /**
   * Generate shader source
   * @param  {string}          shaderType [description]
   * @param  {MaterialFactory} factory    [description]
   * @param  {string}          source     [description]
   * @return {string}                     [description]
   */
  private static _getShaderSource(shaderType: string, factory: MaterialFactory, source: string): string {
    return `#define ${shaderType}\n${factory.shaderHeader}\n${factory.macro.macroString}\n/*BEGINNING OF USER CODE*/\n${source}`;
  }

  /**
   * Obtain attribute variable names from passInfo
   * @param  {ISORTPassInfo} passInfo [description]
   * @return {string[]}               [description]
   */
  private static _getAttributeNames(passInfo: ISORTPassInfo): string[] {
    const attributes: string[] = [];
    for (let key in passInfo.attributes) {
      attributes.push(key);
    }
    return attributes;
  }

  /**
   * Append configuration task of gl to pre pass tasks.
   * @param  {IMaterialArgument} tasks [description]
   * @return {[type]}                  [description]
   */
  private static _appendGLConfigurators(tasks: ((p: SORTPass, a: IMaterialArgument) => void)[], passInfo: ISORTPassInfo): void {
    const configurators = passInfo.configurator;
    for (let i = 0; i < configurators.length; i++) {
      tasks.push((p) => configurators[i](p.program.gl));
    }
  }

  /**
   * Append registration task of uniform variables exposed to attributes.
   * @param  {IMaterialArgument} tasks [description]
   * @return {[type]}                  [description]
   */
  private static _appendUserVariableRegistration(tasks: ((p: SORTPass, a: IMaterialArgument) => void)[], passInfo: ISORTPassInfo): void {
    for (let key in passInfo.gomlAttributes) {
      const registerer = passInfo.gomlAttributes[key].register;
      tasks.push((p, m) => registerer(p.program.uniforms, m));
    }
  }

  /**
   * Append registration task of uniform variables registered by environment.
   * @param  {IMaterialArgument} tasks [description]
   * @return {[type]}                  [description]
   */
  private static _appendSystemVariableRegistration(tasks: ((p: SORTPass, a: IMaterialArgument) => void)[], passInfo: ISORTPassInfo): void {
    for (let i = 0; i < passInfo.systemRegisterers.length; i++) {
      tasks.push((p, args) => passInfo.systemRegisterers[i](p.program.uniforms, args));
    }
  }
}
