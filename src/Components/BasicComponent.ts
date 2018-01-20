import Namespace from "grimoirejs/ref/Core/Namespace";
import Component from "grimoirejs/ref/Core/Component";
import Timer from "../Util/Timer";
import AssetLoadingManager from "./AssetLoadingManagerComponent";
import LoopManager from "./LoopManagerComponent";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
type TimerCoroutine = GeneratorFunction;
type CoroutineTuple = { coroutine: Iterator<number>; next: number; container: Component; tag?: string | symbol };

class CoroutineRegistry {
  public coroutines: CoroutineTuple[] = [];

  public callCoroutine(criteria: number, timer: Timer): void {
    let removeTarget: CoroutineTuple[];
    this.coroutines.forEach(val => {
      if (val.next <= criteria) {
        if (val.container.disposed) { // if component was disposed, coroutine will be deleted
          if (!removeTarget) {
            removeTarget = [];
          }
          removeTarget.push(val);
          return; // Skip current coroutine
        }
        if (!val.container.isActive) {
          return;
        }
        const next = val.coroutine.next(timer);
        if (next.done || next.value < 0) { // if coroutine was finished
          if (!removeTarget) {
            removeTarget = [];
          }
          removeTarget.push(val);
        } else {
          if (val.next + next.value < criteria) { // some frames are dropped
            val.next = criteria;
          } else {
            val.next = val.next + next.value;
          }
        }
      }
    });
    if (removeTarget) { // remove actually
      // remove completed tasks
      removeTarget.forEach(f => {
        const i = this.coroutines.indexOf(f);
        this.coroutines.splice(i, 1);
      });
    }
  }

  public register(container: Component, coroutine: () => IterableIterator<number>, tag?: string | symbol): void {
    const generator = coroutine.call(container);
    this.coroutines.push({
      coroutine: generator,
      next: 0,
      container,
      tag,
    });
  }

  public unregister(container: Component, tag?: string | symbol): void {
    const removeTarget: CoroutineTuple[] = [];
    if (tag) {
      this.coroutines.forEach(f => {
        if (f.container === container && f.tag === tag) {
          removeTarget.push(f);
        }
      });
    } else {
      this.coroutines.forEach(f => {
        if (f.container === container) {
          removeTarget.push(f);
        }
      });
    }
    removeTarget.forEach(v => {
      const index = this.coroutines.indexOf(v);
      this.coroutines.splice(index);
    });
  }
}

export default class BasicComponent extends Component {
  public static componentName = "BasicComponent";
  public static attributes: { [name: string]: IAttributeDeclaration } = {};
  private _loopManagerBackingStore: LoopManager;

  private _assetLoadingManagerBackingStore: AssetLoadingManager;

  /**
   * Getter for loop manager used for loop mamnagement
   * @return {LoopManager} [description]
   */
  public get loopManager(): LoopManager {
    if (!this._loopManagerBackingStore) {
      const lm = this.node.getComponentInAncestor(LoopManager);
      if (!lm) {
        throw new Error("LoopManager is not found.");
      }
      this._loopManagerBackingStore = lm;
    }
    return this._loopManagerBackingStore;
  }
  /**
   * Getter for assetLoading manager
   * @return {LoopManager} [description]
   */
  public get assetLoadingManager(): AssetLoadingManager {
    if (!this._assetLoadingManagerBackingStore) {
      const alm = this.node.getComponentInAncestor(AssetLoadingManager);
      if (!alm) {
        throw new Error("AssetLoadingManager is not found.")
      }
      this._assetLoadingManagerBackingStore = alm;
    }
    return this._assetLoadingManagerBackingStore;
  }

  /**
   * Register coroutine invoked by timer in millisecound.
   * Yield values from coroutine will be used as next frame to recall the generator.
   * Ensure this is not called exactly specified timing. This will be called in the frame after specified timing.
   */
  protected __registerTimerCoroutine(coroutine: () => IterableIterator<number>, tag?: string | symbol): void {
    // check companion containing coroutine cache
    let coroutines = this.companion.get("timer-coroutine") as CoroutineRegistry;
    if (!coroutines) {
      coroutines = new CoroutineRegistry();
      this.loopManager.register((t: Timer) => coroutines.callCoroutine(t.time, t), 100);
      this.companion.set(Namespace.define(this.node.name.ns.qualifiedName).for("timer-coroutine"), coroutines);
    }
    coroutines.register(this, coroutine, tag);
  }
  /**
   * Register coroutine invoked by timer in frame count.
   * Yield values from coroutine will be used as next frame to recall the generator.
   */
  protected __registerFrameCoroutine(coroutine: () => IterableIterator<number>, tag?: string | symbol): void {
    // check companion containing coroutine cache
    let coroutines = this.companion.get("frame-coroutine") as CoroutineRegistry;
    if (!coroutines) {
      coroutines = new CoroutineRegistry();
      this.loopManager.register((t: Timer) => coroutines.callCoroutine(t.frameCount, t), 100);
      this.companion.set(Namespace.define(this.node.name.ns.qualifiedName).for("frame-coroutine"), coroutines);
    }
    coroutines.register(this, coroutine, tag);
  }
  /**
   * Call method after specified time elapsed.
   * If the component was disabled, specified method will be called after component being enabled.
   * @param  {Timer}  method [description]
   * @return {[type]}        [description]
   */
  protected __invoke(method: (timer: Timer) => void, timeInMillis: number): void {
    const _that = this;
    this.__registerTimerCoroutine(function* () {
      const timer = yield timeInMillis;
      method.call(_that, timer as Timer);
    });
  }

  protected __unregisterTimerCoroutine(tag?: string | symbol): void {
    const coroutines = this.companion.get("timer-coroutine") as CoroutineRegistry;
    if (coroutines) {
      coroutines.unregister(this, tag);
    }
  }

  protected __unregisterFrameCoroutine(tag?: string | symbol): void {
    const coroutines = this.companion.get("frame-coroutine") as CoroutineRegistry;
    if (coroutines) {
      coroutines.unregister(this, tag);
    }
  }

  protected __registerAssetLoading<T>(loadingPromise: Promise<T>): Promise<T> {
    return this.assetLoadingManager.loader.register(loadingPromise, this);
  }
}
