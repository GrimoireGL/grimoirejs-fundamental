import GrimoireJS from "grimoirejs";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Geometry from "../../Geometry/Geometry";
import IMaterialArgument from "../../Material/IMaterialArgument";
import IRenderRendererMessage from "../../Messages/IRenderRendererMessage";
import GeometryRegistoryComponent from "../GeometryRegistoryComponent";
import MaterialContainerComponent from "../MaterialContainerComponent";
import SingleBufferRenderStageBase from "./SingleBufferRenderStageBase";
export default class RenderQuadComponent extends SingleBufferRenderStageBase {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    indexGroup: {
      default: "default",
      converter: "String",
    },
    technique: {
      default: "default",
      converter: "String",
    },
  };

  public technique: string;

  private indexGroup: string;

  private _gl: WebGLRenderingContext;

  private _geom: Geometry;

  private _materialContainer: MaterialContainerComponent;

  protected $awake(): void {
    super.$awake();
    this.metadata.type = "Quad";
    this.getAttributeRaw("indexGroup").bindTo("indexGroup");
    this.getAttributeRaw("technique").bindTo("technique");
    this.getAttributeRaw("technique").watch((t: string) => {
      this.metadata.technique = t;
    }, true);
  }

  public async $mount(): Promise<void> {
    this._gl = this.companion.get("gl");
    this._materialContainer = this.node.getComponent(MaterialContainerComponent);
    const geometryRegistry = this.companion.get("GeometryRegistory") as GeometryRegistoryComponent;
    this._geom = await geometryRegistry.getGeometry("quad");
  }

  protected $renderRenderStage(args: IRenderRendererMessage): void {
    if (!this._materialContainer.materialReady || !this._geom) {
      return;
    }
    if (!this.__beforeRender()) {
      return;
    }
    // make rendering argument
    const renderArgs = {
      indexGroup: this.indexGroup,
      geometry: this._geom,
      camera: null,
      transform: null,
      viewport: this.out.getViewport(),
      technique: this.technique,
      sceneDescription: {},
      rendererDescription: this.rendererDescription,
    } as IMaterialArgument;
    // do render
    this._materialContainer.material.draw(renderArgs);
    this._gl.flush();
  }
}
