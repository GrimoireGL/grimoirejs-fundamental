import ResourceBase from "./ResourceBase";
export default class Shader extends ResourceBase {
  public shader: WebGLShader;

  constructor(gl: WebGLRenderingContext, public readonly type: number, public sourceCode?: string) {
    super(gl);
    this.shader = gl.createShader(type);
    if (sourceCode) {
      this.update(sourceCode);
    }
  }

  public update(source: string): void {
    this.gl.shaderSource(this.shader, source);
    this.gl.compileShader(this.shader);
    if (!this.gl.getShaderParameter(this.shader, WebGLRenderingContext.COMPILE_STATUS)) {
      throw new Error(`Compiling shader failed.\nSourceCode:\n${source}\n\nErrorCode:${this.gl.getShaderInfoLog(this.shader)}`);
    }
    this.sourceCode = source;
    this.valid = true;
  }

  public destroy(): void {
    super.destroy();
    this.gl.deleteShader(this.shader);
  }
}
