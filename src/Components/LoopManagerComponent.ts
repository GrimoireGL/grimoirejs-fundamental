import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Timer from "../Util/Timer";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import { NumberConverter } from "grimoirejs/ref/Converter/NumberConverter";
import { IConverterDeclaration, IStandardConverterDeclaration } from "grimoirejs/ref/Interface/IAttributeConverterDeclaration";
import Identity from "grimoirejs/ref/Core/Identity";
import { attribute, watch } from "grimoirejs/ref/Core/Decorator";
interface LoopAction {
  action(timer: Timer): void;
  priorty: number;
}

/**
 * LoopManager manages entire loop of canvas.
 * This component will arrange loop actions that will be fired by requestAnimationFrame.
 */
export default class LoopManager extends Component {
  public static componentName = "LoopManager";

  /*
  * Updating loop is enabled or not.
   * If 
  */
  @attribute(BooleanConverter, false)
  public loopEnabled!: boolean;

  private _loopActions: LoopAction[] = [];

  private _registerNextLoop: () => void = () => {
    window.requestAnimationFrame(this._loop.bind(this));
  };

  private _timer: Timer = new Timer();

  protected $mount(): void {
    this._timer.internalUpdate();
  }

  /**
   * Register loop action to be called on every loop.
   * Consider using $update for any objects inside of scene.
   * @param action an function to be called on every loop.
   * @param priorty priorty of loop. All registered loop actions are called by ascending order.
   */
  public register(action: (timer: Timer) => void, priorty: number): void {
    this._loopActions.push({
      action,
      priorty,
    });
    this._loopActions.sort((a, b) => a.priorty - b.priorty);
  }

  /**
   * Execute one frame manually.
   * @param followFPSRestriction When the value is true and executed frame as surpassing rate of FPS, next frame will be ignored to follow FPS restriction.
   */
  public tick(followFPSRestriction: boolean = false): void {
    if (this._timer.internalUpdate() || !followFPSRestriction) {
      this.node.emit("loop", {
        timer: this._timer,
      });
      this._loopActions.forEach((a) => a.action(this._timer));
    }
  }

  @watch("loopEnabled")
  private _onLoopEnabledChanged(): void {
    if (this.loopEnabled) {
      this._begin();
    }
  }

  private _begin(): void {
    this._registerNextLoop();
  }

  private _loop(): void {
    this.tick(true);
    if (this.loopEnabled) {
      this._registerNextLoop();
    }
  }

}
