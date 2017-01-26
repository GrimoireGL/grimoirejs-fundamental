import gr from "grimoirejs";
import IDObject from "grimoirejs/ref/Base/IDObject";


abstract class ResourceBase {
  private static _maxIndex:number = 0;

  public index:number;

  public destroyed: boolean = false;

  public validPromise: Promise<ResourceBase>;

  private _valid: boolean;

  private _validResolve: (r: ResourceBase) => void;

  public get valid(): boolean {
    return this._valid;
  }

  public set valid(val: boolean) {
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
  constructor(public gl: WebGLRenderingContext) {
    this.index = ResourceBase._maxIndex++;
    this.valid = false;
  }

  public destroy(): void {
    this.destroyed = true;
  }
}

export default ResourceBase;
