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
          // Register pass variable as a attribute of this tag.
          // Pass variables are registered with nested namespaces as following syntax.
          // ${techniqueName}.pass${passIndex}.${variableName}
          // EX) hitarea.pass0.enabled
          this.__addAttribute(argumentFQN, pass.argumentDeclarations[argumentKey]);
          try {
            if (typeof pass.arguments[argumentKey] !== "undefined") {
              this.setAttribute(argumentFQN, pass.arguments[argumentKey]);
            }
            // Register handlers to update pass variables when tag variable was changed
            this.getAttributeRaw(argumentFQN).watch((n, o) => {
              pass.setArgument(argumentKey, n, o);
            }, true);
          } catch (e) {
            throw new Error(`Parsing variable failed`);
          }
        }
      }
    }
  }
}
