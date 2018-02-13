import DefaultMacro from "./Defaults/DefaultMacro";
/**
 * Manage macros which would be appended head of all shaders grimoire.js would load.
 */
export default class MacroRegistry {

  /**
   * The map of macro.
   */
  private _macro: { [macroName: string]: string } = {};

  /**
   * Handlers functions for changing macro.
   */
  private _observers: { [macroName: string]: ((value: string, isImmediateCall: boolean) => void)[] } = {};

  constructor() {
    for (const key in DefaultMacro) {
      this.setValue(key, DefaultMacro[key]);
    }
  }

  /**
   * Set the value of macros.
   * @param {string}    key [description]
   * @param {string =   null}        val [description]
   */
  public setValue(key: string, val: string = null): void {
    if (val === null) {
      val = "";
    }
    if (this._macro[key] !== val) {
      this._macro[key] = val;
      if (!this._observers[key]) {
        this._observers[key] = [];
      }
      this._notifyMacroChanged(key, val);
    }
  }

  /**
   * Get the value of macro.
   * @param  {string} key [description]
   * @return {string}     [description]
   */
  public getValue(key: string): string {
    const macro = this._macro[key];
    if (macro === null) {
      return "";
    } else {
      return macro;
    }
  }

  public watch(macroName: string, handler: (value: string, isImmediateCall: boolean) => void, immediate = false): void {
    let observers = this._observers[macroName];
    if (!observers) {
      observers = this._observers[macroName] = [];
    }
    observers.push(handler);
    if (immediate && this._macro[macroName] !== void 0) {
      handler(this._macro[macroName], true);
    }
  }

  public unwatch(macroName: string, handler: (value: string, isImmediateCall: boolean) => void): boolean {
    const observers = this._observers[macroName];
    if (!observers) {
      return false;
    }
    for (let i = 0; i < observers.length; i++) {
      if (observers[i] === handler) {
        observers.splice(i, 1);
        return true;
      }
    }
  }

  private _notifyMacroChanged(key: string, value: string): void {
    for (let i = 0; i < this._observers[key].length; i++) {
      this._observers[key][i](value, false);
    }
  }
}
