import MaterialFactory from "./MaterialFactory";
import ITechniqueRecipe from "./ITechniqueRecipe";
import Technique from "./Technique";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import IMaterialArgument from "./IMaterialArgument";
import Pass from "./Pass";
/**
 * Provides abstraction of configurations for multiple shaders.
 */
export default class Material {

    public techniques: { [key: string]: Technique } = {};

    constructor(public gl: WebGLRenderingContext, public techniqueRecipes: { [key: string]: ITechniqueRecipe }) {
        for (let key in techniqueRecipes) {
            this.techniques[key] = new Technique(this, techniqueRecipes[key]);
        }
    }

    public draw(arg: IMaterialArgument): void {
        const technique = this.techniques[arg.technique];
        if (technique) {
            technique.draw(arg);
        }
    }

    /**
     * Clone this material to new instance.
     * @return {Material} new material instance
     */
    public clone(): Material {
        const cloned = new Material(this.gl, this.techniqueRecipes);
        for (let techniqueKey in this.techniques) {
          const technique = this.techniques[techniqueKey];
          const destTechnique = cloned.techniques[techniqueKey];
          for (let passIndex in technique.passes) {
            const pass = technique.passes[passIndex];
            const destPass = destTechnique.passes[passIndex];
            for (let argument in pass.arguments) {
              destPass[argument] = pass[argument];
            }
          }
        }
        return cloned;
    }
}
