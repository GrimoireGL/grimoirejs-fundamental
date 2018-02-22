import GrimoireJS from "grimoirejs";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderRendererMessage from "../../Messages/IRenderRendererMessage";
import CameraComponent from "../CameraComponent";
import SingleBufferRenderStageBase from "./SingleBufferRenderStageBase";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import { ComponentConverter, getGenericComponentConverter, IComponentConverter } from "grimoirejs/ref/Converter/ComponentConverter";
import { StandardAttribute, LazyAttribute } from "grimoirejs/ref/Core/Attribute";
import Component from "grimoirejs/ref/Core/Component";
import Identity from "grimoirejs/ref/Core/Identity";
import IRenderingTarget from "../../Resource/RenderingTarget/IRenderingTarget";
import { Nullable } from "grimoirejs/ref/Tool/Types";
import Color4 from "grimoirejs-math/ref/Color4";
import { companion, attribute, watch } from "grimoirejs/ref/Core/Decorator";

/**
 * Render a scene specified by camera.
 * This 
 */
export default class RenderSceneComponent extends SingleBufferRenderStageBase {
  public static componentName = "RenderSceneComponent";

  /**
   * Layer of scene to render.
   * MeshRenderer also have same property named layer.
   * RenderScene only try to render the mesn have same layer name.
   */
  @attribute(StringConverter, "default")
  public layer!: string;

  /**
   * Camera referrence to be rendered.
   */
  @attribute(ComponentConverter, "camera", "camera", { target: "Camera" })
  public camera: Nullable<CameraComponent> = null;

  /**
   * Technique to be renderred.
   */
  @attribute(StringConverter, "default")
  public technique!: string;

  @companion("gl")
  private _gl!: WebGLRenderingContext;

  // messages

  protected $awake(): void {
    this.metadata.type = "scene";
  }

  protected $renderRenderStage(args: IRenderRendererMessage): void {
    if (this.getAttributeRaw("camera").isPending || !this.camera) {
      return;
    }
    if (!this.__beforeRender()) {
      return;
    }
    //TODO: fix this should not resolved every time
    this.camera = this.getAttribute("camera");
    if (!this.camera) {
      return;
    }
    this.camera!.updateContainedScene(args.timer);
    this.camera!.renderScene({
      renderer: this,
      camera: this.camera!,
      layer: this.layer,
      viewport: this.out.getViewport(),
      timer: args.timer,
      technique: this.technique,
      sceneDescription: {},
      rendererDescription: this.rendererDescription,
    });
  }
  @watch("technique", true)
  @watch("layer")
  private _onMetadataChange(): void { // For Spector.js
    this.metadata.technique = this.technique;
    this.metadata.layer = this.layer;
  }
}
