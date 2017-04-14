import gr from "grimoirejs";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Timer from "../Util/Timer";
interface LoopAction {
    action: (timer: Timer) => void;
    priorty: number;
}

/**
 * 全体のループを管理しているコンポーネント。あまり直接ユーザーがいじることはありません。
 */
class LoopManagerComponent extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        loopEnabled: {
            default: false,
            converter: "Boolean"
        },
        fpsRestriction: {
            default: 60,
            converter: "Number"
        }
    };

    private _loopActions: LoopAction[] = [];

    private _registerNextLoop: () => void;

    private _timer: Timer;

    public $awake(): void {
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

    public $mount(): void {
        this.getAttributeRaw("loopEnabled").watch((attr) => {
            if (attr) {
                this._begin();
            }
        });
        this.getAttributeRaw("fpsRestriction").watch((attr) => {
            this._timer.fpsRestriction = attr;
        }, true);
        this._timer = new Timer();
        this._timer.internalUpdate();
    }

    public register(action: (timer: Timer) => void, priorty: number): void {
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
        if (this._timer.internalUpdate()) {
            this.node.emit("loop", {
                timer: this._timer
            });
            this._loopActions.forEach((a) => a.action(this._timer));
        }
        this._registerNextLoop();
    }

}

export default LoopManagerComponent;
