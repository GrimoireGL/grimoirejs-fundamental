import BasicComponent from "./BasicComponent";
import Material from "../Material/Material";

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
    const lastArguments = material.arguments; // Inherit last material argument if exists
    material.arguments = {};
    for (let key in material.argumentDeclarations) {
        this.__addAttribute(key, material.argumentDeclarations[key]);
        try {
            this.getAttributeRaw(key).watch((n) => {
              material.setArgument(key, n);
            }, true);
            if (lastArguments[key] !== void 0) { // TODO need to compare last converter is same as current one
                this.setAttribute(key, lastArguments[key]);
            }
        } catch (e) {
            throw new Error(`Parsing variable failed`);
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
