import gr from "grimoirejs";
import MaterialContainerComponent from "../MaterialContainerComponent";
import GeometryRegistoryComponent from "../GeometryRegistoryComponent";
import Geometry from "../../Geometry/Geometry";
import IMaterialArgument from "../../Material/IMaterialArgument";
import IRenderRendererMessage from "../../Messages/IRenderRendererMessage";
import Framebuffer from "../../Resource/FrameBuffer";
import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Color4 from "grimoirejs-math/ref/Color4";
import Viewport from "../../Resource/Viewport";
import IRenderingTarget from "../../Resource/RenderingTarget/IRenderingTarget";
import SingleBufferRenderStageBase from "./SingleBufferRenderStageBase";
export default class RenderQuadComponent extends SingleBufferRenderStageBase {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    indexGroup: {
      default: "default",
      converter: "String",
    },
    technique: {
      default: "default",
      converter: "String"
    }
  };

  public technique: string;

  private indexGroup: string;

  private _gl: WebGLRenderingContext;

  private _geom: Geometry;

  private _materialContainer: MaterialContainerComponent;

  public $awake(): void {
    super.$awake();
    this.getAttributeRaw("indexGroup").boundTo("indexGroup");
    this.getAttributeRaw("technique").boundTo("technique");
  }

  public async $mount(): Promise<void> {
    this._gl = this.companion.get("gl");
    this._materialContainer = this.node.getComponent(MaterialContainerComponent);
    const gr = this.companion.get("GeometryRegistory") as GeometryRegistoryComponent;
    this._geom = await gr.getGeometry("quad");
  }

  public $render(args: IRenderRendererMessage): void {
    if (!this._materialContainer.materialReady || !this._geom) {
      return;
    }
    this.__beforeRender();
    // make rendering argument
    const renderArgs = <IMaterialArgument>{
      indexGroup: this.indexGroup,
      geometry: this._geom,
      camera: null,
      transform: null,
      viewport: args.viewport,
      technique: this.technique,
      sceneDescription: {}
    };
    // do render
    this._materialContainer.material.draw(renderArgs);
    this._gl.flush();
  }
}
