import Namespace from "grimoirejs/ref/Core/Namespace";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Material from "../Material/Material";
import BasicComponent from "./BasicComponent";

/**
 * Base class for container component for material and material arguments.
 * Basically used for MaterialComponent and MaterialContainerComponent
 */
export default class MaterialContainerBase extends BasicComponent {
  public static componentName = "MaterialContainerBase";

  protected _lastParameters: { [key: string]: IAttributeDeclaration & { __lastValue?: any } } = {};

  /**
   * Expose sepcified parameters as attribute parameters on this component
   * @param {Material} material [description]
   */
  protected __exposeMaterialParameters(material: Material, keepVariable = true): void {
    const nextParameters: { [key: string]: IAttributeDeclaration } = {};
    for (const techniqueName in material.techniques) {
      const technique = material.techniques[techniqueName];
      for (const passIndex in technique.passes) {
        const pass = technique.passes[passIndex];
        const passNamespace = Namespace.define(`${techniqueName}.pass${passIndex}`);
        for (const argumentKey in pass.argumentDeclarations) {
          const argumentFQN = passNamespace.for(argumentKey).fqn;
          // Register pass variable as a attribute of this tag.
          // Pass variables are registered with nested namespaces as following syntax.
          // ${techniqueName}.pass${passIndex}.${variableName}
          // EX) hitarea.pass0.enabled
          nextParameters[argumentFQN] = pass.argumentDeclarations[argumentKey];
          this.__addAttribute(argumentFQN, pass.argumentDeclarations[argumentKey]);
          try {
            if (typeof pass.arguments[argumentKey] !== "undefined") {
              this.setAttribute(argumentFQN, pass.arguments[argumentKey]);
            } else if (keepVariable && this._lastParameters[argumentFQN] !== void 0 && this._lastParameters[argumentFQN].converter === pass.argumentDeclarations[argumentKey].converter) {
              this.setAttribute(argumentFQN, this._lastParameters[argumentFQN].__lastValue);
            }
            // Register handlers to update pass variables when tag variable was changed
            this.getAttributeRaw(argumentFQN).watch((n, o) => {
              pass.setArgument(argumentKey, n, o);
            }, true);
          } catch (e) {
            throw new Error("Parsing variable failed");
          }
        }
      }
    }
    this._lastParameters = nextParameters;
    this.node.emit("material-parameter-updated", nextParameters);
  }

  protected __removeExposedMaterialParameters(): void {
    for (const key in this._lastParameters) {
      this._lastParameters[key].__lastValue = this.getAttribute(key);
      this.__removeAttributes(key);
    }
  }
}
