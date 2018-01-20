import GLResource from "./GLResource";
export default class Shader extends GLResource<WebGLShader> {
  constructor(gl: WebGLRenderingContext, public readonly type: number, public sourceCode?: string) {
    super(gl, gl.createShader(type)!);
    if (sourceCode) {
      this.update(sourceCode);
    }
  }

  public update(source: string): void {
    this.gl.shaderSource(this.resourceReference, source);
    this.gl.compileShader(this.resourceReference);
    if (!this.gl.getShaderParameter(this.resourceReference, WebGLRenderingContext.COMPILE_STATUS)) {
      throw new Error(`Compiling shader failed.\nSourceCode:\n${this._insertLineNumbers(source)}\n\nErrorCode:${this.gl.getShaderInfoLog(this.resourceReference)}`);
    }
    this.sourceCode = source;
    this.valid = true;
  }

  public destroy(): void {
    super.destroy();
    this.gl.deleteShader(this.resourceReference);
  }

  private _insertLineNumbers(source: string): string {
    source = "1:" + source;
    let lN = 2;
    for (let i = 0; i < source.length; i++) {
      const c = source.charAt(i);
      if (c === "\n") {
        source = source.substring(0, i + 1) + `${lN}:` + source.substring(i + 1, source.length);
        i++;
        lN++;
      }
    }
    return source;
  }
}
