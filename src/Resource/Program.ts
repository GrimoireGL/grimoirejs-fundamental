import UniformProxy from "./UniformProxy";
import ResourceBase from "./ResourceBase";
import Shader from "./Shader";
export default class Program extends ResourceBase {
  public readonly program: WebGLProgram;

  public uniforms: UniformProxy;

  private _uniformLocations: { [variableName: string]: WebGLUniformLocation } = {};

  private _attributeLocations: { [variableName: string]: number } = {};

  constructor(gl: WebGLRenderingContext) {
    super(gl);
    this.uniforms = new UniformProxy(this);
    this.program = gl.createProgram();
  }

  public update(shaders: Shader[]): void {
    if (this.valid) {
      // detach all attached shaders previously
      const preciousShaders = this.gl.getAttachedShaders(this.program);
      preciousShaders.forEach(s => this.gl.detachShader(this.program, s));
    }
    shaders.forEach(shader => {
      this.gl.attachShader(this.program, shader.shader);
    });
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, WebGLRenderingContext.LINK_STATUS)) {
      const errorLog = this.gl.getProgramInfoLog(this.program);
      throw new Error(`LINK FAILED\n${errorLog}`);
    }
    this.valid = true;
  }

  public use(): void {
    this.gl.useProgram(this.program);
    this.uniforms.onUse();
  }

  public destroy(): void {
    super.destroy();
    this.gl.deleteProgram(this.program);
  }

  public findAttributeLocation(variableName: string): number {
    if (typeof this._attributeLocations[variableName] === "undefined") {
      this._attributeLocations[variableName] = this.gl.getAttribLocation(this.program, variableName);
      this._safeEnableVertexAttribArray(this._attributeLocations[variableName]);
      return this._attributeLocations[variableName];
    } else {
      return this._attributeLocations[variableName];
    }
  }

  public findUniformLocation(variableName: string): WebGLUniformLocation {
    if (typeof this._uniformLocations[variableName] === "undefined") {
      return this._uniformLocations[variableName] = this.gl.getUniformLocation(this.program, variableName);
    } else {
      return this._uniformLocations[variableName];
    }
  }

  private _safeEnableVertexAttribArray(location: number): void {
    if (location < 0) {
      return;
    }
    this.gl.enableVertexAttribArray(location);
  }
}
