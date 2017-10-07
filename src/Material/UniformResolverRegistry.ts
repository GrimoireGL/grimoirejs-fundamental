import UniformProxy from "../Resource/UniformProxy";
import IMaterialArgument from "./IMaterialArgument";
import Material from "./Material";
import Pass from "./Pass";
import PassProgram from "./PassProgram";
import IPassRecipe from "./Schema/IPassRecipe";
import IVariableInfo from "./Schema/IVariableInfo";
import Technique from "./Technique";
import UniformResolverContainer from "./UniformResolverContainer";

export type IUniformRegisterOnRegister = (proxy: UniformProxy, args: IMaterialArgument) => void;

export type IUniformRegisterOnDispose = () => void;

export type IUniformRegisterOnUpdate = (passProgram: PassProgram, newValue: any, oldValue: any) => void;

export type IUniformRegisterer = (variableInfo: IVariableInfo, pass: Pass, technique: Technique, material: Material) => IUniformRegisterOnRegister | {
    register: IUniformRegisterOnRegister,
    dispose?: IUniformRegisterOnDispose,
    update?: IUniformRegisterOnUpdate,
  };

export class UniformResolverRegistry {

  private _generators: { [semantics: string]: IUniformRegisterer } = {};

  public add (semantic: string, generator: IUniformRegisterer): void {
    if (typeof generator !== "function") {
      throw new Error("secound argument of add must be function");
    }
    this._generators[semantic.toUpperCase()] = generator;
  }

  public generateRegisterers (pass: Pass, passInfo: IPassRecipe): UniformResolverContainer {
    const registerers: IUniformRegisterOnRegister[] = [], disposers: IUniformRegisterOnDispose[] = [], updators: { [variableName: string]: IUniformRegisterOnUpdate } = {};
    for (const key in passInfo.uniforms) {
      const valueInfo = passInfo.uniforms[key];
      const semantic = valueInfo.semantic;
      const registeredGenerator = this._generators[semantic];
      if (!registeredGenerator) {
        throw new Error(`There was no suitable registerer for specified semantic ${semantic}`);
      }
      const registerer = registeredGenerator(valueInfo, pass, pass.technique, pass.material);
      if (typeof registerer === "function") {
        registerers.push(registerer);
      } else {
        registerers.push(registerer.register);
        if (registerer.dispose) {
          disposers.push(registerer.dispose);
        }
        if (registerer.update) {
          updators[key] = registerer.update;
        }
      }
    }
    return new UniformResolverContainer(registerers, disposers, updators);
  }
}

export default new UniformResolverRegistry();
