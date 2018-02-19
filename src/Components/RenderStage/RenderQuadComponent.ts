import GrimoireJS from "grimoirejs";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Geometry from "../../Geometry/Geometry";
import IMaterialArgument from "../../Material/IMaterialArgument";
import IRenderRendererMessage from "../../Messages/IRenderRendererMessage";
import GeometryRegistryComponent from "../GeometryRegistryComponent";
import MaterialContainer from "../MaterialContainerComponent";
import SingleBufferRenderStageBase from "./SingleBufferRenderStageBase";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import IRenderingTarget from "../../Resource/RenderingTarget/IRenderingTarget";
import Color4 from "grimoirejs-math/ref/Color4";
import { LazyAttribute, StandardAttribute } from "grimoirejs/ref/Core/Attribute";
import { companion, attribute, watch } from "grimoirejs/ref/Core/Decorator";

/**
 * Render to quad.
 * Typically used for post effect processing.
 */
export default class RenderQuadComponent extends SingleBufferRenderStageBase {
  public static componentName = "RenderQuadComponent";

  /**
   * Technique to be rendered.
   */
  @attribute(StringConverter, "default")
  public technique!: string;
  /**
   * Indexgroup of quad to be used.
   * If specify this attribute as "wireframe", render quad using wireframe.
   */
  @attribute(StringConverter, "default")
  public indexGroup!: string;

  @companion("gl")
  private _gl!: WebGLRenderingContext;

  private _quadGeometry!: Geometry;

  private _materialContainer!: MaterialContainer;

  protected $awake(): void {
    this.metadata.type = "Quad";
  }

  public async $mount(): Promise<void> {
    this._materialContainer = this.node.getComponent(MaterialContainer)!;
    const geometryRegistry = this.companion.get("GeometryRegistry") as GeometryRegistryComponent;
    this._quadGeometry = await geometryRegistry.getGeometry("quad");
  }

  protected $renderRenderStage(args: IRenderRendererMessage): void {
    if (!this._materialContainer.useMaterial || !this._quadGeometry || !this.__beforeRender()) {
      return;
    }
    // make rendering argument
    const renderArgs = {
      indexGroup: this.indexGroup,
      geometry: this._quadGeometry,
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

  @watch("technique", true)
  private _onTechniqueChange(): void {
    this.metadata.technique = this.technique;
  }
}
