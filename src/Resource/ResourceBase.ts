import IDObject from "grimoirejs/lib/Core/Base/IDObject";


abstract class ResourceBase extends IDObject {
  public destroyed: boolean = false;
  constructor(public gl: WebGLRenderingContext) {
    super();
  }

  public destroy(): void {
    this.destroyed = true;
  }
}

export default ResourceBase;
