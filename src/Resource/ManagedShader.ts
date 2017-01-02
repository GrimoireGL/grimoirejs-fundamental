import HashCalculator from "../Util/HashCalculator";
import Shader from "./Shader";
/**
 * Provides abstraction of shader instance.
 * If specified shader source was instanced already, delegate actual instance.
 * And counts reference of shader and if that shader was released and the count is zero, this shader resource would be deleted automatically.
 *
 * DO NOT instanciate this class directly. Use getShader method instead.
 */
export default class ManagedShader extends Shader{
  private static _managedShaders:Map<WebGLRenderingContext,{[key:number]:ManagedShader}> = new Map<WebGLRenderingContext,{[key:number]:ManagedShader}>();

  /**
   * Obtain a reference to shader.
   * @param  {WebGLRenderingContext} gl     [description]
   * @param  {number}                type   [description]
   * @param  {string}                shader [description]
   * @return {ManagedShader}                [description]
   */
  public static getShader(gl:WebGLRenderingContext,type:number,shader:string):ManagedShader{
    if(!ManagedShader._managedShaders.has(gl)){
      ManagedShader._managedShaders.set(gl,{});
    }
    const shaders = ManagedShader._managedShaders.get(gl);
    const hash = HashCalculator.calcHash(shader + type);
    if(shaders[hash] === void 0){
      shaders[hash] = new ManagedShader(gl,type,shader,hash);
    }
    shaders[hash]._referenceCount++;
    return shaders[hash];
  }

  private _referenceCount:number = 0;

  constructor(gl: WebGLRenderingContext, public readonly type: number, public sourceCode: string,public hash:number) {
    super(gl,type,sourceCode);
  }

  /**
   * Release shader instance from reference.
   * Do not call this method dupelicately per a getShader call.
   *
   * That would make this shader disposed unintendedly.
   */
  public release():void{
    this._referenceCount--;
    if(this._referenceCount === 0){
      this.destroy();
      ManagedShader._managedShaders.get(this.gl)[this.hash] = void 0;
    }
  }
}
