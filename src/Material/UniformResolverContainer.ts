import {IUniformRegisterOnRegister, IUniformRegisterOnDispose} from "./UniformResolverRegistry";
import UniformProxy from "../Resource/UniformProxy";
import IMaterialArgument from "./IMaterialArgument";
/**
 * Container of uniform registerers resolved by UniformResolverRegistry already.
 * @param  {IUniformRegisterOnRegister[]} publicregisterers [description]
 * @param  {IUniformRegisterOnDispose[]}  publicdisposers   [description]
 * @return {[type]}                                         [description]
 */
export default class UniformResolverContainer {
  constructor(public registerers: IUniformRegisterOnRegister[], public disposers: IUniformRegisterOnDispose[]) {

  }
  /**
   * Resolve uniform variables to pass gpu
   * @param {UniformProxy}      proxy [description]
   * @param {IMaterialArgument} args  [description]
   */
  public resolve(proxy: UniformProxy, args: IMaterialArgument): void {
    this.registerers.forEach(r => r(proxy, args));
  }
  /**
   * Dispose all resolvers
   */
  public dispose(): void {
    this.disposers.forEach(d => d());
  }
}
