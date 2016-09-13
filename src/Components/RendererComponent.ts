import IBufferUpdatedMessage from "../Messages/IBufferUpdatedMessage";
import IResizeBufferMessage from "../Messages/IResizeBufferMessage";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import Texture2D from "../Resource/Texture2D";
import CameraComponent from "./CameraComponent";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";
import {Rectangle} from "grimoirejs-math";

export default class RendererComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    camera: {
      converter: "component",
      defaultValue: "camera",
      target: "CAMERA"
    },
    viewport: {
      converter: "viewport",
      defaultValue: "auto"
    }
  };

  private _camera: CameraComponent;

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _viewport: Rectangle;

  private _buffers: { [key: string]: Texture2D } = {};

  public $mount(): void {
    this._gl = this.companion.get("gl") as WebGLRenderingContext;
    this._canvas = this.companion.get("canvasElement") as HTMLCanvasElement;
    this._camera = this.getValue("camera");
    this.attributes.get("camera").addObserver((v) => this._camera = v.Value);
    this._viewport = this.getValue("viewport");
    this.attributes.get("viewport").addObserver((v) => this._viewport = v.Value);
  }

  public $treeInitialized(): void {
    this.node.broadcastMessage(1, "resizeBuffer", <IResizeBufferMessage>{ // TODO apply when viewport was changed
      width: this._viewport.Width,
      height: this._viewport.Height,
      buffers: this._buffers
    });
    this.node.broadcastMessage(1, "bufferUpdated", <IBufferUpdatedMessage>{
      buffers: this._buffers
    });
  }

  public $renderScene(): void {
    if (this._camera) {
      this.node.broadcastMessage(1, "render", <IRenderRendererMessage>{
        camera: this._camera,
        viewport: this._viewport,
        buffers: this._buffers
      });
    }
  }
}
