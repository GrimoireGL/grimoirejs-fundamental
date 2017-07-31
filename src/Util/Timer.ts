export default class Timer {

  public timeScale = 1;
  public fpsRestriction = 60;
  private _time: number;
  private _lastRealTime: number;
  private _unrestrictedLastRealTime: number;
  private _accumlatedSkipFrame = 0;
  private _deltaTime: number;
  private _frameCount = 0;
  private _lastFPS: number;

  public get deltaTime() {
    return this._deltaTime;
  }

  public get time() {
    return this._time;
  }

  public get timeInSecound() {
    return this._time / 1000;
  }

  public get frameCount() {
    return this._frameCount;
  }

  public get FPS() {
    return this._lastFPS ? this._lastFPS.toFixed(2) : Number.NaN;
  }

  /**
   * Do not call this method manually.
   * This method is only use for internal procedure in framework.
   * @return {[type]} [description]
   */
  public internalUpdate(): boolean {
    this._frameCount++;
    const time = Date.now();
    if (this._shouldUpdate(time)) {
      this._updateTimer(time);
      return true;
    } else {
      return false;
    }
  }

  private _shouldUpdate(time: number): boolean {
    if (this._time === void 0) {
      this._unrestrictedLastRealTime = time;
      return true; // first frame
    } else {
      const realDelta = time - this._unrestrictedLastRealTime;
      const idealDelta = 1000 / this.fpsRestriction;
      this._unrestrictedLastRealTime = time;
      if (Math.abs(idealDelta - realDelta * 2.0 - this._accumlatedSkipFrame) < Math.abs(idealDelta - realDelta - this._accumlatedSkipFrame)) {
        this._accumlatedSkipFrame += realDelta;
        return false;
      } else {
        this._accumlatedSkipFrame = 0;
        return true;
      }
    }
  }

  private _updateTimer(time: number): void {
    if (this._lastRealTime === undefined) {
      this._time = 0;
      this._deltaTime = 0;
    } else {
      this._deltaTime = time - this._lastRealTime;
      this._time += this.timeScale * this._deltaTime;
    }
    this._lastRealTime = time;
    if (this._lastFPS === undefined) {
      if (this.deltaTime !== 0) {
        this._lastFPS = 1000 / this.deltaTime;
      }
    } else {
      this._lastFPS = (this._lastFPS + (1000 / this.deltaTime)) / 2;
    }
  }
}
