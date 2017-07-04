import BasicComponent from "./BasicComponent";
import Material from "../Material/Material";
import Namespace from "grimoirejs/ref/Base/Namespace";

/**
 * Base class for container component for material and material arguments.
 * Basically used for MaterialComponent and MaterialContainerComponent
 */
export default class MaterialContainerBase extends BasicComponent {
  /**
   * Expose sepcified parameters as attribute parameters on this component
   * @param {Material} material [description]
   */
  protected __exposeMaterialParameters(material: Material): void {
    for (let techniqueName in material.techniques) {
      const technique = material.techniques[techniqueName];
      for (let passIndex in technique.passes) {
        const pass = technique.passes[passIndex];
        const passNamespace = Namespace.define(`${techniqueName}.pass${passIndex}`);
        for (let argumentKey in pass.argumentDeclarations) {
          const argumentFQN = passNamespace.for(argumentKey).fqn;
          this.__addAttribute(argumentFQN, pass.argumentDeclarations[argumentKey]);
          try {
              this.getAttributeRaw(argumentFQN).watch((n, o) => {
                pass.setArgument(argumentKey, n, o);
              }, true);
          } catch (e) {
              throw new Error(`Parsing variable failed`);
          }
        }
      }
    }
    for (let key in material.macroDeclarations) {
        this.__addAttribute(key, material.macroDeclarations[key]);
        this.getAttributeRaw(key).watch((v) => {
            material.setMacroValue(key, v);
        }, true);
    }
  }
}
