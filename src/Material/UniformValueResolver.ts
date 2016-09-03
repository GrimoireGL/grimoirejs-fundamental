import IMaterialArgument from "./IMaterialArgument";
import UniformProxy from "../Resource/UniformProxy";
import IVariableInfo from "./IVariableInfo";
export default class UniformValueResolver {
  public static resolvers: { [key: string]: (valInfo: IVariableInfo, name: string) => Promise<((proxy: UniformProxy, args: IMaterialArgument) => void)> } = {};

  public static addResolver(name: string, resolvers: (valInfo: IVariableInfo, name: string) => Promise<((proxy: UniformProxy, args: IMaterialArgument) => void)>): void {
    UniformValueResolver.resolvers[name] = resolvers;
  }

  public static resolve(name: string, valInfo: IVariableInfo): Promise<((proxy: UniformProxy, args: IMaterialArgument) => void)> {
    if (UniformValueResolver.resolvers[name]) {
      return UniformValueResolver.resolvers[name](valInfo, name);
    }
  }
}

UniformValueResolver.addResolver("_matPVM", async (valInfo, name) => (proxy, args) => proxy.uniformMatrix(name, args.transform.calcPVW(args.camera)));
UniformValueResolver.addResolver("_time", async (valInfo, name) => (proxy, args) => proxy.uniformFloat(name, Date.now() % 1000000));
