import Color4 from "grimoirejs-math/ref/Color4";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import LoopManagerComponent from "./LoopManagerComponent";
import Component from "grimoirejs/ref/Node/Component";
import Timer from "../Util/Timer";
import gr from "grimoirejs";
/**
 * 全レンダラーを管理するためのコンポーネント
 */
export default class RendererManagerComponent extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        /**
         * キャンバスの初期化色
         */
        bgColor: {
            default: new Color4(0, 0, 0, 0),
            converter: "Color4"
        },
        /**
         * キャンバスの初期化深度値
         */
        clearDepth: {
            default: 1.0,
            converter: "Number"
        },
        /**
         * goml内にrendererが一つもなかった場合に自動的に補完するかどうか
         */
        complementRenderer: {
            default: true,
            converter: "Boolean"
        }
    };

    public gl: WebGLRenderingContext;

    private _bgColor: Color4;

    private _clearDepth: number;

    public $awake(): void {
        this.getAttributeRaw("bgColor").boundTo("_bgColor");
        this.getAttributeRaw("clearDepth").boundTo("_clearDepth");
    }

    public $mount(): void {
        this.gl = this.companion.get("gl");
    }

    public $treeInitialized(): void {
        this.node.getComponent(LoopManagerComponent).register(this.onloop.bind(this), 1000);
        if (this.getAttribute("complementRenderer") && this.node.getChildrenByNodeName("renderer").length === 0) {
            this.node.addChildByName("renderer", {});
        }
    }


    public onloop(timer: Timer): void {
        if (this.enabled) {
            const c: Color4 = this._bgColor;
            this.gl.clearColor(c.R, c.G, c.B, c.A);
            this.gl.clearDepth(this._clearDepth);
            this.gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT | WebGLRenderingContext.DEPTH_BUFFER_BIT);
            this.node.broadcastMessage(1, "renderViewport", {
                timer: timer
            });
        }
    }
}
