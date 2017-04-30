import {IUniformRegisterOnRegister, IUniformRegisterOnDispose, IUniformRegisterOnUpdate} from "./UniformResolverRegistry";
import UniformProxy from "../Resource/UniformProxy";
import IMaterialArgument from "./IMaterialArgument";
import PassProgram from "./PassProgram";
/**
 * Container of uniform registerers resolved by UniformResolverRegistry already.
 * @param  {IUniformRegisterOnRegister[]} publicregisterers [description]
 * @param  {IUniformRegisterOnDispose[]}  publicdisposers   [description]
 * @return {[type]}                                         [description]
 */
export default class UniformResolverContainer {
  constructor(public registerers: IUniformRegisterOnRegister[], public disposers: IUniformRegisterOnDispose[], public updators: {[variableName: string]: IUniformRegisterOnUpdate}) {

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

  /**
   * Update specified variable
   * @param {string} variableName [description]
   */
  public update(passProgram: PassProgram, variableName: string, newValue: any, oldValue: any): void {
    if (this.updators[variableName]) {
      this.updators[variableName](passProgram, newValue, oldValue);
    }
  }
}
