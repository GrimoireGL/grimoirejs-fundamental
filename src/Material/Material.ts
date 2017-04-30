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

    /**
     * Material arguments.
     * Thease are mainly created by USER_VALUE semantics.
     */
    public argumentDeclarations: { [key: string]: IAttributeDeclaration } = {};

    /**
     * Values of materila arguments.
     * Thease values would be passed to GPU for rendering.
     */
    public arguments: { [key: string]: any } = {};

    /**
     * Dynamic macro declarations.
     */
    public macroDeclarations: { [key: string]: IAttributeDeclaration } = {};

    public techniques: { [key: string]: Technique } = {};

    private _macroObserver: { [key: string]: ((value: boolean | number) => void)[] } = {};

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

    public setArgument(variableName: string, newValue: any): void {
      if (this.arguments[variableName] !== newValue) {
        const o = this.arguments[variableName];
        this.arguments[variableName] = newValue;
        for (let key in this.techniques) {
          const t = this.techniques[key];
          t.passes.forEach(p => p.update(variableName, newValue, o));
        }
      }
    }

    public addMacroObserver(key: string, macroDeclaration: IAttributeDeclaration, onChanged: (value: boolean | number) => void): void {
        if (!this._macroObserver[key]) {
            this._macroObserver[key] = [];
        }
        this._macroObserver[key].push(onChanged);
        this.macroDeclarations[key] = macroDeclaration;
    }

    public setMacroValue(key: string, value: boolean | number): void {
        if (this._macroObserver[key]) {
            this._macroObserver[key].forEach(o => o(value));
        }
    }

    public addArgument(key: string, argumentDeclaration: IAttributeDeclaration): void {
        this.argumentDeclarations[key] = argumentDeclaration;
    }

    public deleteArgument(key: string): void {
        delete this.argumentDeclarations[key];
    }

    /**
     * Clone this material to new instance.
     * @return {Material} new material instance
     */
    public clone(): Material {
        const cloned = new Material(this.gl, this.techniqueRecipes);
        for (let key in this.arguments) {
            cloned.arguments[key] = this.arguments[key];
        }
        return cloned;
    }
}
