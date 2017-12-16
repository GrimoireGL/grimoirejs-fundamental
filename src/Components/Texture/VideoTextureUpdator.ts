import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import VideoResolver from "../../Asset/VideoResolver";
import Texture2D from "../../Resource/Texture2D";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";
export default class VideoTextureUpdatorComponent extends TextureUpdatorComponentBase<Texture2D> {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    src: {
      converter: "String",
      default: null,
    },
    currentTime: {
      converter: "Number",
      default: 0,
    },
    muted: {
      converter: "Boolean",
      default: true,
    },
    playbackRate: {
      converter: "Number",
      default: 1,
    },
    loop: {
      converter: "Boolean",
      default: true,
    },
  };

  public flipY: boolean;

  public premultipliedAlpha: boolean;

  public src: string;

  public video: HTMLVideoElement;

  public currentTime: number;

  public muted: boolean;

  public playbackRate: number;

  public loop: boolean;

  protected $awake() {
    super.$awake();
    this.__bindAttributes();
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
  }

  public resize(width: number, height: number): void {
    if (this.video) {
      this.video.width = width;
      this.video.height = height;
      this.tryUpdateCurrentFrame();
    }
  }

  private *_update() {
    while (true) {
      if (this.currentTime !== this.video.currentTime) {
        this.currentTime = this.video.currentTime;
      }
      this.tryUpdateCurrentFrame();
      yield 1;
    }
  }

  private tryUpdateCurrentFrame() {
    if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
      this.__texture.update(this.video, {
        premultipliedAlpha: this.premultipliedAlpha,
        flipY: this.flipY,
      });
    }
  }

  private async _loadTask(src: string): Promise<void> {
    this.video = await VideoResolver.resolve(src);
    this.__registerFrameCoroutine(this._update);
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
