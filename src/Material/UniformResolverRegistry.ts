import IPassRecipe from "./IPassRecipe";
import IMaterialArgument from "./IMaterialArgument";
import Material from "./Material";
import IVariableInfo from "./IVariableInfo";

export interface IUniformRegisterOnRegister {
  (args: IMaterialArgument, variableInfo: IVariableInfo, material: Material): void;
}

export interface IUniformRegisterOnDispose {
  (variableInfo: IVariableInfo, material: Material): void;
}


export interface IUniformRegisterer {
  (variableInfo: IVariableInfo, material: Material): IUniformRegisterOnRegister | {
    register: IUniformRegisterOnRegister,
    dispose?: IUniformRegisterOnDispose
  };
}

export class UniformResolverRegistry {

  private _generators: { [semantics: string]: IUniformRegisterer } = {};

  public add(semantic: string, generator: IUniformRegisterer): void {
    if (typeof generator !== "function") {
      throw new Error("secound argument of add must be function");
    }
    this._generators[semantic.toUpperCase()] = generator;
  }

  public generateRegisterers(passInfo: IPassRecipe, material: Material): {
    registerers: IUniformRegisterOnRegister[],
    disposers: IUniformRegisterOnDispose[]
  } {
    const registerers: IUniformRegisterOnRegister[] = [], disposers: IUniformRegisterOnDispose[] = [];
    for (let key in passInfo.uniforms) {
      const valueInfo = passInfo.uniforms[key];
      const semantic = valueInfo.semantic;
      const registeredGenerator = this._generators[semantic];
      if (!registeredGenerator) {
        throw new Error(`There was no suitable registerer for specified semantic ${semantic}`);
      }
      const registerer = registeredGenerator(valueInfo, material);
      if (typeof registerer === "function") {
        registerers.push(registerer);
      } else {
        registerers.push(registerer.register);
        if (registerer.dispose) {
          disposers.push(registerer.dispose);
        }
      }
    }
    return {
      registerers: registerers,
      disposers: disposers
    };
  }
}

export default new UniformResolverRegistry();