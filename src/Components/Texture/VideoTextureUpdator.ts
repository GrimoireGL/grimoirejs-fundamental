import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import VideoResolver from "../../Asset/VideoResolver";
import Texture2D from "../../Resource/Texture2D";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";
import Identity from "grimoirejs/ref/Core/Identity";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import { NumberConverter } from "grimoirejs/ref/Converter/NumberConverter";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import { Nullable } from "grimoirejs/ref/Tool/Types";
import { attribute, watch } from "grimoirejs/ref/Core/Decorator";

export default class VideoTextureUpdator extends TextureUpdatorComponentBase<Texture2D> {
  public static componentName = "VideoTextureUpdator";

  @attribute(StringConverter, null)
  public src!: string;
  @attribute(NumberConverter, 0)
  public currentTime!: number;
  @attribute(BooleanConverter, true)
  public muted!: boolean;
  @attribute(NumberConverter, 1)
  public playbackRate!: number;
  @attribute(BooleanConverter, true)
  public loop!: boolean;

  public video!: HTMLVideoElement;

  public resize(width: number, height: number): void {
    if (this.video) {
      this.video.width = width;
      this.video.height = height;
      this.tryUpdateCurrentFrame();
    }
  }
  @watch("src", true)
  private _onSrcChanged(): void {
    if (this.src !== null) {
      this._loadTask(this.src);
    }
  }
  @watch("currentTime")
  private _onTimeChanged(): void {
    if (this.video && this.video.currentTime !== this.currentTime) {
      this._syncVideoPref();
    }
  }

  @watch("muted")
  @watch("playbackRate")
  @watch("loop")
  private _onPlayerConfigChanged(): void {
    if (this.video) {
      this._syncVideoPref();
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
