import IMaterialArgument from "./IMaterialArgument";
import Pass from "./Pass";
export default class Material {
  public initialized: boolean;

  public initializePromise: Promise<void>;

  public pass: Pass[];

  constructor(public passFactories: Promise<Pass>[]) {
    this._waitForInitializing();
  }

  private async _waitForInitializing(): Promise<void> {
    this.pass = await (this.initializePromise = Promise.all(this.passFactories));
    this.initialized = true;
  }

  public draw(arg: IMaterialArgument): void {
    if (this.initialized) {
      this.pass.forEach(p => p.draw(arg));
    }
  }
}
