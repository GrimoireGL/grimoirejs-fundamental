import GeometryRegistoryComponent from "./GeometryRegistoryComponent";
import Geometry from "../Geometry/Geometry";
import IMaterialArgument from "../Material/IMaterialArgument";
import ResourceBase from "../Resource/ResourceBase";
import SORTPass from "../Material/SORTPass";
import AssetLoader from "../Asset/AssetLoader";
import MaterialComponent from "./MaterialComponent";
import Material from "../Material/Material";
import IRenderSceneMessage from "../Messages/IRenderSceneMessage";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import IBufferUpdatedMessage from "../Messages/IBufferUpdatedMessage";
import Framebuffer from "../Resource/FrameBuffer";
import Component from "grimoirejs/lib/Core/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration";
import {Color4} from "grimoirejs-math";

export default class RenderQuadComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    material: {
      defaultValue: undefined,
      converter: "material",
      componentBoundTo: "_materialComponent"
    },
    out: {
      defaultValue: "default",
      converter: "string"
    },
    targetBuffer: {
      defaultValue: "default",
      converter: "string",
      boundTo: "_targetBuffer"
    },
    clearColor: {
      defaultValue: "#0000",
      converter: "color4",
      boundTo: "_clearColor"
    },
    clearColorEnabled: {
      defaultValue: true,
      converter: "boolean",
      boundTo: "_clearColorEnabled"
    }
  };

  private _targetBuffer: string;

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _fbo: Framebuffer;

  private _material: Material;

  private _materialComponent: MaterialComponent;

  private _materialArgs: { [key: string]: any } = {};

  private _geom: Geometry;

  private _clearColor: Color4;

  private _clearColorEnabled: boolean;

  public $mount() {
    this._gl = this.companion.get("gl");
    this._canvas = this.companion.get("canvasElement");
    const gr = this.companion.get("GeometryRegistory") as GeometryRegistoryComponent;
    this._geom = gr.getGeometry("quad");
    this.attributes.get("material").addObserver(this._onMaterialChanged);
    this._onMaterialChanged();
  }

  private _onMaterialChanged(): void {
    if (!this._materialComponent) { // the material must be instanciated by attribute.
      this._prepareInternalMaterial();
    } else {
      this._prepareExternalMaterial();
    }
  }

  private async _prepareExternalMaterial(): Promise<void> {
    const materialPromise = this.getValue("material") as Promise<Material>
    const loader = this.companion.get("loader") as AssetLoader;
    loader.register(materialPromise);
    const material = await materialPromise;
    this._material = material;
  }

  private async _prepareInternalMaterial(): Promise<void> {
    // obtain promise of instanciating material
    const materialPromise = this.getValue("material") as Promise<Material>;
    const loader = this.companion.get("loader") as AssetLoader;
    loader.register(materialPromise);
    if (!materialPromise) {
      return;
    }
    const material = await materialPromise;
    const promises: Promise<any>[] = [];
    material.pass.forEach((p) => {
      if (p instanceof SORTPass) {
        for (let key in p.programInfo.gomlAttributes) {
          const val = p.programInfo.gomlAttributes[key];
          this.__addAtribute(key, val);
          this.attributes.get(key).addObserver((v) => {
            this._materialArgs[key] = v.Value;
          });
          const value = this._materialArgs[key] = this.getValue(key);
          if (value instanceof ResourceBase) {
            promises.push((value as ResourceBase).validPromise);
          }
        }
      }
    });
    await Promise.all(promises);
    this._material = material;
  }

  public $bufferUpdated(args: IBufferUpdatedMessage) {
    const out = this.getValue("out");
    if (out !== "default") {
      this._fbo = new Framebuffer(this.companion.get("gl"));
      this._fbo.update(args.buffers[out]);
    }
  }

  public $render(args: IRenderRendererMessage) {
    if (!this._material) {
      return;
    }
    // bound render target
    if (this._fbo) {
      this._fbo.bind();
      this._gl.viewport(0, 0, args.viewport.Width, args.viewport.Height);
    } else {
      this._gl.bindFramebuffer(WebGLRenderingContext.FRAMEBUFFER, null);
      this._gl.viewport(args.viewport.Left, this._canvas.height - args.viewport.Bottom, args.viewport.Width, args.viewport.Height);
    }
    // clear buffer if needed
    if (this._fbo && this._clearColorEnabled) {
      this._gl.clearColor(this._clearColor.R, this._clearColor.G, this._clearColor.B, this._clearColor.A);
      this._gl.clear(WebGLRenderingContext.COLOR_BUFFER_BIT);
    }
    // make rendering argument
    const renderArgs = <IMaterialArgument>{
      targetBuffer: this._targetBuffer,
      geometry: this._geom,
      attributeValues: {},
      camera: args.camera.camera,
      transform: null,
      buffers: args.buffers,
      viewport: args.viewport
    };
    if (this._materialComponent) {
      renderArgs.attributeValues = this._materialComponent.materialArgs;
    } else {
      renderArgs.attributeValues = this._materialArgs;
    }
    // do render
    this._material.draw(renderArgs);
  }
}
