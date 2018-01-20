import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import { IConverterDeclaration, IStandardConverterDeclaration } from "grimoirejs/ref/Interface/IAttributeConverterDeclaration";

/**
 * フルスクリーン状態を管理するコンポーネント
 * Grimoire.jsによって管理されているキャンバス(正確にはその親のコンテナ)のフルスクリーン状態等を管理します。
 * (他の要素をフルスクリーン化することも可能ですが、通常このGrimoire.jsによって生成されるキャンバスを含むDOM要素に対して用いられます。)
 * また、一部の古いブラウザでは動作しない機能であることに注意してください。
 * また、`fullscreen`属性は必ず マウスのイベントなどのユーザーのインタラクションを伴うイベントからの呼び出しで **動的に** trueにされる必要があります。
 * 最初からtrueに設定して初期状態でキャンバスをフルスクリーン状態にすることはWebAPIの制約上できません。
 */
export default class Fullscreen extends Component {
  public static componentName = "Fullscreen";
  public static attributes = {
    /**
     * フルスクリーン状態かどうか
     *
     * このフラグをtrueにする際は、**必ず**、マウスイベントなどのユーザーのインタラクションを伴うイベントからの呼び出しで変更されなければなりません。
     *
     * したがって、GOMLで初期状態からこのフラグをtrueにすることはできません。
     */
    fullscreen: {
      converter: BooleanConverter,
      default: false,
    },
    /**
     * フルスクリーンにするDOM要素へのクエリ
     *
     * nullが指定された場合、キャンバスの親要素が用いられます。
     */
    fullscreenTarget: {
      converter: StringConverter,
      default: null,
    },
  };

  private _fullscreen = false;

  protected $awake(): void {
    this.getAttributeRaw(Fullscreen.attributes.fullscreen)!.watch(attr => {
      attr = !!attr;
      if (this._fullscreen === attr) {
        return;
      }
      this._fullscreen = attr;
      this._switchFullscreen();
    });
  }

  private _switchFullscreen(): void {
    if (this._fullscreen) {
      const target = this.getAttribute(Fullscreen.attributes.fullscreenTarget);
      if (target) {
        const queriedTarget = document.querySelectorAll(target);
        if (queriedTarget[0]) {
          this.requestFullscreen(queriedTarget[0]);
        } else {
          console.warn("Specified fullscreenTarget was not found on HTML dom tree");
        }
      } else {
        this.requestFullscreen(this.companion.get("canvasContainer")!);
      }
    } else {
      this.exitFullscreen();
    }
  }

  private requestFullscreen(target: Element): void {
    const targetany = target as any;
    if (targetany.webkitRequestFullscreen) {
      targetany.webkitRequestFullscreen(); // Chrome15+, Safari5.1+, Opera15+
    } else if (targetany["mozRequestFullScreen"]) {
      targetany["mozRequestFullScreen"](); // FF10+
    } else if (targetany["msRequestFullscreen"]) {
      targetany["msRequestFullscreen"](); // IE11+
    } else if (targetany.requestFullscreen) {
      targetany.requestFullscreen(); // HTML5 Fullscreen API仕様
    } else {
      console.error("Your browser is not supporting full screen feature. Use modern browsers instead.");
      return;
    }
  }
  /*フルスクリーン終了用ファンクション*/
  private exitFullscreen(): void {
    const doc = document as any;
    if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen(); // Chrome15+, Safari5.1+, Opera15+
    } else if (doc["mozCancelFullScreen"]) {
      doc["mozCancelFullScreen"](); // FF10+
    } else if (doc["msExitFullscreen"]) {
      doc["msExitFullscreen"](); // IE11+
    } else if (doc["cancelFullScreen"]) {
      doc["cancelFullScreen"](); // Gecko:FullScreenAPI仕様
    } else if (document.exitFullscreen) {
      document.exitFullscreen(); // HTML5 Fullscreen API仕様
    }
  }
}
