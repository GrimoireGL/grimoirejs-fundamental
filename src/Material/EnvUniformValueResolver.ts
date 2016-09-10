import {Vector2} from "grimoirejs-math";
import IMaterialArgument from "./IMaterialArgument";
import UniformProxy from "../Resource/UniformProxy";
import IVariableInfo from "./IVariableInfo";
/**
 * Environment uniform value resolver
 */
export default class EnvUniformValueResolver {
  /**
   * Static environment uniform value resolvers which names are already known.
   * @type {IVariableInfo}
   */
  public static resolvers: { [key: string]: (valInfo: IVariableInfo, name: string) => ((proxy: UniformProxy, args: IMaterialArgument) => void) } = {};

  /**
   * Dynamic environment uniform value resolvers which names are not known yet.
   * @type {IVariableInfo}
   */
  public static dynamicResolvers: ((valInfo: IVariableInfo, name: string) => ((proxy: UniformProxy, args: IMaterialArgument) => void))[] = [];

  /**
   * Add static environment uniform value resolver to specified name.
   * @param  {string} name     [description]
   * @param  {string} resolver [description]
   * @return {[type]}          [description]
   */
  public static addResolver(name: string, resolver: (valInfo: IVariableInfo, name: string) => ((proxy: UniformProxy, args: IMaterialArgument) => void)): void {
    EnvUniformValueResolver.resolvers[name] = resolver;
  }

  /**
   * Add dynamic environment uniform value resolver.
   * When pasased variable are not resolved by a resolver, that resolver should return null or undefined.
   * @param  {string} resolver [description]
   * @return {[type]}          [description]
   */
  public static addDynamicResolver(resolver: (valInfo: IVariableInfo, name: string) => ((proxy: UniformProxy, args: IMaterialArgument) => void)): void {
    EnvUniformValueResolver.dynamicResolvers.push(resolver);
  }

  public static resolve(name: string, valInfo: IVariableInfo): ((proxy: UniformProxy, args: IMaterialArgument) => void) {
    if (EnvUniformValueResolver.resolvers[name]) {
      return EnvUniformValueResolver.resolvers[name](valInfo, name);
    } else {
      let targetResolver = null;
      for (let i = 0; i < EnvUniformValueResolver.dynamicResolvers.length; i++) {
        targetResolver = EnvUniformValueResolver.dynamicResolvers[i](valInfo, name);
        if (targetResolver != null) {
          return targetResolver;
        }
      }
    }
  }
}

EnvUniformValueResolver.addResolver("_matPVM", (valInfo, name) => (proxy, args) => proxy.uniformMatrix(name, args.transform.calcPVW(args.camera)));
EnvUniformValueResolver.addResolver("_time", (valInfo, name) => (proxy, args) => proxy.uniformFloat(name, Date.now() % 1000000));
EnvUniformValueResolver.addResolver("_viewportSize", (valInfo, name) => {
  const cacheVec = new Vector2(0, 0);
  return (proxy, args) => {
    cacheVec.X = args.viewport.Width;
    cacheVec.Y = args.viewport.Height;
    proxy.uniformVector2(name, cacheVec);
  };
});
EnvUniformValueResolver.addDynamicResolver((valInfo, name) => {
  if (valInfo.variableType === "sampler2D" && valInfo.variableAnnotation["type"] === "backbuffer") {
    return (proxy, mat) => {
      proxy.uniformTexture2D(name, mat.buffers[valInfo.variableAnnotation["name"]]);
    };
  }
});
