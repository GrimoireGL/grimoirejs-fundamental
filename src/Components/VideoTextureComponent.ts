import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import TextureComponent from "./TextureComponent";
import VideoResolver from "../Asset/VideoResolver";
import LoopManager from "./LoopManagerComponent";
export default class VideoTextureComponent extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        src: {
            converter: "String",
            default: null
        },
        flipY: {
            converter: "Boolean",
            default: false
        },
        premultipliedAlpha: {
            converter: "Boolean",
            default: false
        },
        currentTime: {
            converter: "Number",
            default: 0
        },
        muted: {
            converter: "Boolean",
            default: true
        },
        playbackRate: {
            converter: "Number",
            default: 1
        },
        loop: {
            converter: "Boolean",
            default: true
        }
    };

    public flipY: boolean;

    public premultipliedAlpha: boolean;

    public src: string;

    public video: HTMLVideoElement;

    public currentTime: number;

    public muted: boolean;

    public playbackRate: number;

    public loop: boolean;

    private _textureComponent: TextureComponent;

    private _loopManager: LoopManager;

    public $mount() {
        this.__bindAttributes();
        this._textureComponent = this.node.getComponent(TextureComponent);
        this._loopManager = this.tree("goml").single().getComponent(LoopManager);
        this.getAttributeRaw("src").watch((v: string) => {
            if (v !== null) {
                this._loadTask(v);
            }
        }, true);
        this.getAttributeRaw("currentTime").watch((v: number) => {
            if (this.video && this.video.currentTime !== this.currentTime) {
                this._syncVideoPref();
            }
        });
        this.getAttributeRaw("muted").watch(() => {
            if (this.video) {
                this._syncVideoPref();
            }
        });
        this.getAttributeRaw("playbackRate").watch(() => {
            if (this.video) {
                this._syncVideoPref();
            }
        });
        this.getAttributeRaw("loop").watch(() => {
            if (this.video) {
                this._syncVideoPref();
            }
        });
        this._loopManager.register(index => {
            this._update();
        }, 100);
    }

    private _update() {
        if (!this.video) {
            return;
        }
        if (this.currentTime !== this.video.currentTime) {
            this.currentTime = this.video.currentTime;
        }
        if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
            this._textureComponent.texture.update(this.video, {
                premultipliedAlpha: this.premultipliedAlpha,
                flipY: this.flipY
            });
        }
    }

    private async _loadTask(src: string): Promise<void> {
        this.video = await VideoResolver.resolve(src);
        this.video.play();
        this._syncVideoPref();
        this._update();
    }

    private _syncVideoPref(): void {
        this.video.playbackRate = this.playbackRate;
        this.video.muted = this.muted;
        this.video.loop = this.loop;
        this.video.currentTime = this.currentTime;
    }
}
