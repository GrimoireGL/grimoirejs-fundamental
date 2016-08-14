import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";

interface LoopAction {
  action: () => void;
  priorty: number;
}

class LoopManagerComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    loopEnabled: {
      defaultValue: false,
      converter: "boolean"
    }
  };

  private _loopActions: LoopAction[] = [];

  private _registerNextLoop: () => void;

  public $awake() {
    this.attributes.get("loopEnabled").addObserver((attr) => {
      this._begin();
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

  public register(action: () => void, priorty: number) {
    this._loopActions.push({
      action: action,
      priorty: priorty
    });
    this._loopActions.sort((a, b) => a.priorty - b.priorty);
  }

  private _begin() {
    this._registerNextLoop();
  }

  private _loop() {
    this._loopActions.forEach((a) => a.action());
    this._registerNextLoop();
  }

}

export default LoopManagerComponent;
