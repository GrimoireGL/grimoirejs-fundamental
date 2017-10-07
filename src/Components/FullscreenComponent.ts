import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

/**
 * フルスクリーン状態を管理するコンポーネント
 * Grimoire.jsによって管理されているキャンバス(正確にはその親のコンテナ)のフルスクリーン状態等を管理します。
 * (他の要素をフルスクリーン化することも可能ですが、通常このGrimoire.jsによって生成されるキャンバスを含むDOM要素に対して用いられます。)
 * また、一部の古いブラウザでは動作しない機能であることに注意してください。
 * また、`fullscreen`属性は必ず マウスのイベントなどのユーザーのインタラクションを伴うイベントからの呼び出しで **動的に** trueにされる必要があります。
 * 最初からtrueに設定して初期状態でキャンバスをフルスクリーン状態にすることはWebAPIの制約上できません。
 */
export default class FullscreenComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    /**
     * フルスクリーン状態かどうか
     *
     * このフラグをtrueにする際は、**必ず**、マウスイベントなどのユーザーのインタラクションを伴うイベントからの呼び出しで変更されなければなりません。
     *
     * したがって、GOMLで初期状態からこのフラグをtrueにすることはできません。
     */
    fullscreen: {
      converter: "Boolean",
      default: false,
    },
    /**
     * フルスクリーンにするDOM要素へのクエリ
     *
     * nullが指定された場合、キャンバスの親要素が用いられます。
     */
    fullscreenTarget: {
      converter: "String",
      default: null,
    },
  };

  private _fullscreen = false;

  public $awake(): void {
    this.getAttributeRaw("fullscreen").watch((attr) => {
      if (this._fullscreen === attr) {
        return;
      }
      this._fullscreen = attr;
      this._switchFullscreen();
    });
  }

  private _switchFullscreen(): void {
    if (this._fullscreen) {
      const target = this.getAttribute("fullscreenTarget");
      if (target) {
        const queriedTarget = document.querySelectorAll(target);
        if (queriedTarget[0]) {
          this.requestFullscreen(queriedTarget[0]);
        } else {
          console.warn("Specified fullscreenTarget was not found on HTML dom tree");
        }
      } else {
        this.requestFullscreen(this.companion.get("canvasContainer"));
      }
    } else {
      this.exitFullscreen();
    }
  }

  private requestFullscreen(target: Element): void {
    if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen(); // Chrome15+, Safari5.1+, Opera15+
    } else if (target["mozRequestFullScreen"]) {
      target["mozRequestFullScreen"](); // FF10+
    } else if (target["msRequestFullscreen"]) {
      target["msRequestFullscreen"](); // IE11+
    } else if (target.requestFullscreen) {
      target.requestFullscreen(); // HTML5 Fullscreen API仕様
    } else {
      console.error("ご利用のブラウザはフルスクリーン操作に対応していません");
      return;
    }
  }
  /*フルスクリーン終了用ファンクション*/
  private exitFullscreen(): void {
    if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen(); // Chrome15+, Safari5.1+, Opera15+
    } else if (document["mozCancelFullScreen"]) {
      document["mozCancelFullScreen"](); // FF10+
    } else if (document["msExitFullscreen"]) {
      document["msExitFullscreen"](); // IE11+
    } else if (document["cancelFullScreen"]) {
      document["cancelFullScreen"](); // Gecko:FullScreenAPI仕様
    } else if (document.exitFullscreen) {
      document.exitFullscreen(); // HTML5 Fullscreen API仕様
    }
  }
}
