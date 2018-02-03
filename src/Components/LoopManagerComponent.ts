import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Timer from "../Util/Timer";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import { NumberConverter } from "grimoirejs/ref/Converter/NumberConverter";
import { IConverterDeclaration, IStandardConverterDeclaration } from "grimoirejs/ref/Interface/IAttributeConverterDeclaration";
import Identity from "grimoirejs/ref/Core/Identity";
interface LoopAction {
  action(timer: Timer): void;
  priorty: number;
}

/**
 * 全体のループを管理しているコンポーネント。あまり直接ユーザーがいじることはありません。
 */
export default class LoopManager extends Component {
  public static componentName = "LoopManager";
  public static attributes = {
    loopEnabled: {
      default: false,
      converter: BooleanConverter,
    },
    fpsRestriction: {
      default: 60,
      converter: NumberConverter,
    },
  };

  private _loopActions: LoopAction[] = [];

  private _registerNextLoop: () => void;

  private _timer: Timer;

  protected $awake(): void {
    this._registerNextLoop =
      window.requestAnimationFrame  // if window.requestAnimationFrame is defined or undefined
        ?
        () => { // When window.requestAnimationFrame is supported
          window.requestAnimationFrame(this._loop.bind(this));
        }
        :
        () => { // When window.requestAnimationFrame is not supported.
          window.setTimeout(this._loop.bind(this), 1000 / 60);
        };
  }

  protected $mount(): void {
    this.getAttributeRaw(LoopManager.attributes.loopEnabled)!.watch(attr => {
      if (attr == null) {
        throw new Error("LoopManager.loopEnabled must not be null.")
      }
      if (attr) {
        this._begin();
      }
    });

    this._timer = new Timer();
    this.getAttributeRaw(LoopManager.attributes.fpsRestriction)!.watch(attr => {
      if (attr == null) {
        throw new Error("LoopManager.fpsRestriction must not be null.")
      }
      this._timer.fpsRestriction = attr;
    }, true);
    this._timer.internalUpdate();
  }

  public register(action: (timer: Timer) => void, priorty: number): void {
    this._loopActions.push({
      action,
      priorty,
    });
    this._loopActions.sort((a, b) => a.priorty - b.priorty);
  }

  public tick(followFPSRestriction: boolean = true): void {
    if (this._timer.internalUpdate() || !followFPSRestriction) {
      this.node.emit("loop", {
        timer: this._timer,
      });
      this._loopActions.forEach((a) => a.action(this._timer));
    }
  }

  private _begin(): void {
    this._registerNextLoop();
  }

  private _loop(): void {
    this.tick();
    this._registerNextLoop();
  }

}
