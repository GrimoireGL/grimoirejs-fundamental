import GrimoireJS from "grimoirejs";
/**
 * Abstraction of gl resource related class.
 * Provides unique index for each resources, promise for wating resource available and destroyed flag.
 */
abstract class GLResource<T> {
  private static _maxIndex = 0;

  public readonly index: number;

  public destroyed = false;

  public validPromise: Promise<GLResource<T>>;

  private _valid: boolean;

  private _metadata: { [key: string]: any } = {};

  private _validResolve: (r: GLResource<T>) => void;

  public get valid(): boolean {
    return this._valid;
  }

  public set valid(val: boolean) {
    if (this._valid === val) {
      return;
    }
    this._valid = val;
    if (this._valid) {
      this.__onValid();
      this._validResolve(this);
    } else {
      this.validPromise = new Promise((resolve) => {
        this._validResolve = resolve;
      });
    }
  }

  /**
   * Metadata containing some useful data for glresource in Debugging.
   */
  public get metadata(): { [key: string]: any } {
    return this._metadata;
  }

  constructor(public gl: WebGLRenderingContext, public resourceReference: T) {
    if (!gl) {
      throw new Error("missing WebGLRenderingContext");
    }
    this.index = GLResource._maxIndex++;
    if (GrimoireJS.debug) {
      resourceReference["__SPECTOR_Metadata"] = this._metadata;
      this.setMetadata("GL Resource Index", this.index);
    }
    this.valid = false;
  }

  /**
   * Provide metadata for key
   * @param key key of the metadata
   * @param value value of the metadata
   */
  public setMetadata(key: string, value: any): void {
    this._metadata[key] = value;
  }

  public destroy(): void {
    this.destroyed = true;
  }

  protected __onValid(): void {
    return;
  }
}

export default GLResource;
