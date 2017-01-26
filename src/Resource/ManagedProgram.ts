import Shader from "./Shader";
import HashCalculator from "../Util/HashCalculator";
import Program from "./Program";
export default class ManagedProgram extends Program{
  private static _managedPrograms:Map<WebGLRenderingContext,{[hash:number]:ManagedProgram}> = new Map<WebGLRenderingContext,{[hash:number]:ManagedProgram}>();

  public static getProgram(gl:WebGLRenderingContext,shaders:Shader[]):ManagedProgram{
    if(!ManagedProgram._managedPrograms.has(gl)){
      ManagedProgram._managedPrograms.set(gl,{});
    }
    const programs = ManagedProgram._managedPrograms.get(gl);
    let hashSource = "";
    shaders = shaders.sort();
    shaders.forEach(s=>{
      hashSource += s.index + ",";
    });
    const hash = HashCalculator.calcHash(hashSource);
    if(programs[hash] === void 0){
      programs[hash] = new ManagedProgram(gl,hash);
      programs[hash].update(shaders);
    }
    programs[hash]._referenceCount++;
    return programs[hash];
  }

  private _referenceCount:number = 0;

  constructor(gl: WebGLRenderingContext,public hash:number) {
    super(gl);
  }

  public release():void{
    this._referenceCount--;
    if(this._referenceCount === 0){
      this.destroy();
      ManagedProgram._managedPrograms.get(this.gl)[this.hash] = void 0;
    }
  }
}
