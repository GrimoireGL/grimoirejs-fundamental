import Pass from "./Pass";
export default class Material {
  public initialized: boolean;

  constructor(public passFactories: Promise<Pass>[]) {
    this._waitForInitializing();
  }

  private async _waitForInitializing(): Promise<void> {
    await Promise.all(this.passFactories);
    this.initialized = true;
  }

}
