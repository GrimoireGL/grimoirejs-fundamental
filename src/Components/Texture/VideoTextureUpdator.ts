import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import VideoResolver from "../../Asset/VideoResolver";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";

/**
 * no document
 */
export default class VideoTextureUpdatorComponent extends TextureUpdatorComponentBase {

  /**
   * no document
   */
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

  /**
   * no document
   */
  public flipY: boolean;

  /**
   * no document
   */
  public premultipliedAlpha: boolean;

  /**
   * no document
   */
  public src: string;

  /**
   * no document
   */
  public video: HTMLVideoElement;

  /**
   * no document
   */
  public currentTime: number;

  /**
   * no document
   */
  public muted: boolean;

  /**
   * no document
   */
  public playbackRate: number;

  /**
   * no document
   */
  public loop: boolean;

  /**
   * no document
   */
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

  private *_update() {
    while (true) {
      if (this.currentTime !== this.video.currentTime) {
        this.currentTime = this.video.currentTime;
      }
      if (this.video.readyState === this.video.HAVE_ENOUGH_DATA) {
        this.__texture.update(this.video, {
          premultipliedAlpha: this.premultipliedAlpha,
          flipY: this.flipY,
        });
      }
      yield 1;
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
