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

/**
 * Render a scene specified by camera.
 */
export default class RenderSceneComponent extends SingleBufferRenderStageBase {
  public static componentName = "RenderSceneComponent";
  public static attributes = {
    ...SingleBufferRenderStageBase.attributes,
    layer: {
      converter: StringConverter,
      default: "default",
    },
    camera: {
      default: "camera",
      converter: getGenericComponentConverter<CameraComponent>(),
      target: "Camera",
    },
    technique: {
      default: "default",
      converter: StringConverter,
    },
  };

  public layer!: string;

  public camera: Nullable<CameraComponent> = null;

  public technique!: string;

  private _gl!: WebGLRenderingContext;

  // messages

  protected $awake(): void {
    super.$awake();
    this.metadata.type = "scene";
    this.getAttributeRaw(RenderSceneComponent.attributes.layer)!.bindTo("layer");
    this.getAttributeRaw(RenderSceneComponent.attributes.technique)!.bindTo("technique");
    this.getAttributeRaw(RenderSceneComponent.attributes.technique)!.watch((t: Nullable<string>) => {
      this.metadata.technique = t;
    }, true);
    this.getAttributeRaw(RenderSceneComponent.attributes.layer)!.watch((t: Nullable<string>) => {
      this.metadata.layer = t;
    }, true);
  }

  protected $mount(): void {
    this._gl = this.companion.get("gl")!;
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
}
