import GLResource from "./GLResource";
import ResourceCache from "./ResourceCache";
import Shader from "./Shader";
import UniformProxy from "./UniformProxy";

/**
 * Manages WebGLProgram related stuff.
 */
export default class Program extends GLResource<WebGLProgram> {

  /**
   * Reference to uniform proxy which help you to pass uniform variables.
   * @type {UniformProxy}
   */
  public uniforms: UniformProxy;

  private _uniformLocations: { [variableName: string]: WebGLUniformLocation } = {};

  private _attributeLocations: { [variableName: string]: number } = {};

  constructor(gl: WebGLRenderingContext) {
    super(gl, gl.createProgram());
    this.uniforms = new UniformProxy(this);
  }

  /**
   * Check this program is the last used one or not.
   * @return {boolean} [description]
   */
  public get isLastUsed(): boolean {
    return ResourceCache.useProgramCheck(this.gl, this.resourceReference);
  }

  /**
   * Update program with shader instance.
   * The array might be set of vertex shader and fragment shader couple.
   * @param {Shader[]} shaders [description]
   */
  public update(shaders: Shader[]): void {
    if (this.valid) {
      // detach all attached shaders previously
      const preciousShaders = this.gl.getAttachedShaders(this.resourceReference);
      preciousShaders.forEach(s => this.gl.detachShader(this.resourceReference, s));
    }
    this._uniformLocations = {}; // reset location caches
    this._attributeLocations = {};
    // attach all shader passed
    shaders.forEach(shader => {
      this.gl.attachShader(this.resourceReference, shader.resourceReference);
    });
    this.gl.linkProgram(this.resourceReference); // link program and check errors
    if (!this.gl.getProgramParameter(this.resourceReference, WebGLRenderingContext.LINK_STATUS)) {
      const errorLog = this.gl.getProgramInfoLog(this.resourceReference);
      throw new Error(`LINK FAILED\n${errorLog}`);
    }
    this.valid = true;
  }

  /**
   * Use this program for drawing.
   */
  public use(): void {
    if (!this.isLastUsed) {
      this.gl.useProgram(this.resourceReference);
    }
    this.uniforms.onUse();
  }

  /**
   * Destroy this instance.
   */
  public destroy(): void {
    super.destroy();
    this.gl.deleteProgram(this.resourceReference);
    this._uniformLocations = {};
    this._attributeLocations = {};
  }

  /**
   * Fetch attribute location from this program.
   * @param  {string} variableName [description]
   * @return {number}              [description]
   */
  public findAttributeLocation(variableName: string): number {
    if (this._attributeLocations[variableName] === void 0) { // If cache is not available
      this._attributeLocations[variableName] = this.gl.getAttribLocation(this.resourceReference, variableName);
      this._safeEnableVertexAttribArray(this._attributeLocations[variableName]);
      return this._attributeLocations[variableName];
    } else {
      return this._attributeLocations[variableName];
    }
  }
  /**
   * Fetch uniform location from this program
   * @param  {string}               variableName [description]
   * @return {WebGLUniformLocation}              [description]
   */
  public findUniformLocation(variableName: string): WebGLUniformLocation {
    const location = this._uniformLocations[variableName];
    if (location === void 0) { // if cache is not available
      return this._uniformLocations[variableName] = this.gl.getUniformLocation(this.resourceReference, variableName);
    } else {
      return location;
    }
  }

  private _safeEnableVertexAttribArray(location: number): void {
    if (location < 0) {
      return;
    }
    this.gl.enableVertexAttribArray(location);
  }
}
