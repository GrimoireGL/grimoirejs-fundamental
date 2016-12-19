import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

interface LoopAction {
  action: (loopIndex: number) => void;
  priorty: number;
}

class LoopManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    loopEnabled: {
      default: false,
      converter: "Boolean"
    }
  };

  private _loopActions: LoopAction[] = [];

  private _registerNextLoop: () => void;

  private _loopIndex: number = 0;

  public $awake(): void {
    this.getAttributeRaw("loopEnabled").watch((attr) => {
      if (attr) {
        this._begin();
      }
    });
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

  public register(action: (loopIndex: number) => void, priorty: number): void {
    this._loopActions.push({
      action: action,
      priorty: priorty
    });
    this._loopActions.sort((a, b) => a.priorty - b.priorty);
  }

  private _begin(): void {
    this._registerNextLoop();
  }

  private _loop(): void {
    this._loopActions.forEach((a) => a.action(this._loopIndex));
    this._loopIndex++;
    this._registerNextLoop();
  }

}

export default LoopManagerComponent;
