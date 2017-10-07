export class ResourceCache {

  private _lastUsedPrograms: Map<WebGLRenderingContext, WebGLProgram> = new Map<WebGLRenderingContext, WebGLProgram>();
  /**
	 * Save the specified WebGLProgram as last used program.
	 * And check the specified program was used last time.
	 */
  public useProgramCheck(gl: WebGLRenderingContext, program: WebGLProgram): boolean {
    if (this._lastUsedPrograms.get(gl) === program) {
      return true;
    }
    this._lastUsedPrograms.set(gl, program);
    return false;
  }
}

export default new ResourceCache();
