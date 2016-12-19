import gr from "grimoirejs";
import IBufferUpdatedMessage from "../Messages/IBufferUpdatedMessage";
import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "./CameraComponent";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Rectangle from "grimoirejs-math/ref/Rectangle";

export default class RendererComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    camera: {
      converter: "Component",
      default: "camera",
      target: "Camera"
    },
    viewport: {
      converter: "Viewport",
      default: "auto"
    }
  };

  private _camera: CameraComponent;

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _viewportSizeGenerator: (canvas: HTMLCanvasElement) => Rectangle;

  private _viewportCache: Rectangle;

  private _buffers: { [key: string]: Texture2D } = {};

  private _bufferSizes: {
    [bufferName: string]: { width: number, height: number }
  } = {};

  public $mount(): void {
    this._gl = this.companion.get("gl") as WebGLRenderingContext;
    this._canvas = this.companion.get("canvasElement") as HTMLCanvasElement;
    this._camera = this.getAttribute("camera");
    this.getAttributeRaw("camera").watch((v) => this._camera = v);
    this.getAttributeRaw("viewport").watch((v) => {
      this._viewportSizeGenerator = v;
      this.$resizeCanvas();
    });
    this._viewportSizeGenerator = this.getAttribute("viewport");
  }

  public $treeInitialized(): void {
    // This should be called after mounting all of tree nodes in children
    this.$resizeCanvas();
  }

  public $resizeCanvas(): void {
    this._viewportCache = this._viewportSizeGenerator(this._canvas);
    if (this.node.children.length === 0) {
      this.node.addChildByName("render-scene", {});
    }
    this.node.broadcastMessage("resizeBuffer", <IResizeBufferMessage>{ // TODO apply when viewport was changed
      width: this._viewportCache.Width,
      height: this._viewportCache.Height,
      buffers: this._buffers,
      bufferSizes: this._bufferSizes
    });
    this.node.broadcastMessage("bufferUpdated", <IBufferUpdatedMessage>{
      buffers: this._buffers,
      bufferSizes: this._bufferSizes
    });
  }

  public $renderViewport(args: { loopIndex: number }): void {
    this.node.broadcastMessage("render", <IRenderRendererMessage>{
      camera: this._camera,
      viewport: this._viewportCache,
      bufferSizes: this._bufferSizes,
      buffers: this._buffers,
      loopIndex: args.loopIndex
    });
  }

}
