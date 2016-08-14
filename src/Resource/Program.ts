import ResourceBase from "./ResourceBase";
import Shader from "./Shader";
export default class Program extends ResourceBase {
  public readonly program: WebGLProgram;

  public valid: boolean = false;
  constructor(gl: WebGLRenderingContext) {
    super(gl);
    this.program = gl.createProgram();
  }

  public update(shaders: Shader[]): void {
    if (this.valid) {
      // detach all attached shaders previously
      const preciousShaders = this.gl.getAttachedShaders(this.program);
      preciousShaders.forEach(s => this.gl.detachShader(this.program, s));
    }
    shaders.forEach(shader => {
      this.gl.attachShader(this.program, shader);
    });
    this.gl.linkProgram(this.program);
    if (!this.gl.getProgramParameter(this.program, WebGLRenderingContext.LINK_STATUS)) {
      const errorLog = this.gl.getProgramInfoLog(this.program);
      throw new Error(`LINK FAILED\n${errorLog}`);
    }
    this.valid = true;
  }

  public bindAttribLocation(index: number, name: string): void {
    this.gl.bindAttribLocation(this.program, index, name);
  }

  public destroy(): void {
    super.destroy();
    this.gl.deleteProgram(this.program);
  }
}
