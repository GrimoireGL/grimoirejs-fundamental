import Rectangle from "grimoirejs-math/ref/Rectangle";
/**
 * Viewport to be rendered.
 * This class provides configuration methods for WebGL in addition to every features provided by Rectangle.
 */
export default class Viewport extends Rectangle {

  /**
   * Configure viewport to specified gl context.
   * @param gl The gl context
   * @param withoutOffset If this flag was true, configure viewport without left and bottom value of this viewport.
   */
  public configure(gl: WebGLRenderingContext, withoutOffset = false): void {
    if (withoutOffset) {
      gl.viewport(0, 0, this.Width, this.Height);
    } else {
      gl.viewport(this.Left, this.Bottom, this.Width, this.Height);
    }
  }
}
