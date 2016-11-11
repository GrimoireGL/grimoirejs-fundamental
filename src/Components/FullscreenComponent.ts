import gr from "grimoirejs";
const Component = gr.Node.Component;
const IAttributeDeclaration = gr.Node.IAttributeDeclaration;

export default class FullscreenComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    fullscreen: {
      converter: "Boolean",
      defaultValue: false
    }
  };

  private _fullscreen: boolean = false;

  public $awake(): void {
    this.getAttribute("fullscreen").addObserver((attr) => {
      if (this._fullscreen === attr.Value) {
        return;
      }
      this._fullscreen = attr.Value;
      this._switchFullscreen();
    });
  }

  private _switchFullscreen(): void {
    if (this._fullscreen) {
      this.requestFullscreen(this.companion.get("canvasContainer"));
    } else {
      this.exitFullscreen();
    }
  }

  private requestFullscreen(target: Element): void {
    if (target.webkitRequestFullscreen) {
      target.webkitRequestFullscreen(); //Chrome15+, Safari5.1+, Opera15+
    } else if (target["mozRequestFullScreen"]) {
      target["mozRequestFullScreen"](); //FF10+
    } else if (target["msRequestFullscreen"]) {
      target["msRequestFullscreen"](); //IE11+
    } else if (target.requestFullscreen) {
      target.requestFullscreen(); // HTML5 Fullscreen API仕様
    } else {
      console.error('ご利用のブラウザはフルスクリーン操作に対応していません');
      return;
    }
  }
  /*フルスクリーン終了用ファンクション*/
  private exitFullscreen(): void {
    if (document.webkitCancelFullScreen) {
      document.webkitCancelFullScreen(); //Chrome15+, Safari5.1+, Opera15+
    } else if (document["mozCancelFullScreen"]) {
      document["mozCancelFullScreen"](); //FF10+
    } else if (document["msExitFullscreen"]) {
      document["msExitFullscreen"](); //IE11+
    } else if (document["cancelFullScreen"]) {
      document["cancelFullScreen"](); //Gecko:FullScreenAPI仕様
    } else if (document.exitFullscreen) {
      document.exitFullscreen(); // HTML5 Fullscreen API仕様
    }
  }
}
