import Rectangle from "grimoirejs-math/ref/Rectangle";
export default class Viewport extends Rectangle {

  public configure (gl: WebGLRenderingContext, withoutOffset = false): void {
    if (withoutOffset) {
      gl.viewport(0, 0, this.Width, this.Height);
    } else {
      gl.viewport(this.Left, this.Bottom, this.Width, this.Height);
    }
  }
}
