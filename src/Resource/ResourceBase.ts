
/**
 * Abstraction of resource related class.
 * Provides unique index for each resources, promise for wating resource available and destroyed flag.
 */
abstract class ResourceBase {
  private static _maxIndex = 0;

  public readonly index: number;

  public destroyed = false;

  public validPromise: Promise<ResourceBase>;

  private _valid: boolean;

  private _validResolve: (r: ResourceBase) => void;

  public get valid (): boolean {
    return this._valid;
  }

  public set valid (val: boolean) {
    if (this._valid === val) {
      return;
    }
    this._valid = val;
    if (this._valid) {
      this._validResolve(this);
    } else {
      this.validPromise = new Promise((resolve) => {
        this._validResolve = resolve;
      });
    }
  }
  constructor (public gl: WebGLRenderingContext) {
    if (!gl) {
      throw new Error("missing WebGLRenderingContext");
    }
    this.index = ResourceBase._maxIndex++;
    this.valid = false;
  }

  public destroy (): void {
    this.destroyed = true;
  }
}

export default ResourceBase;
