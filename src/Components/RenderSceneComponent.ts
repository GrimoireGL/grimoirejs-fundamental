import ResourceBase from "../Resource/ResourceBase";
import SORTPass from "../Material/SORTPass";
import AssetLoader from "../Asset/AssetLoader";
import MaterialComponent from "./MaterialComponent";
import Material from "../Material/Material";
import {Color4} from "grimoirejs-math";
import IRenderSceneMessage from "../Messages/IRenderSceneMessage";
import Component from "grimoirejs/lib/Node/Component";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";
import IRenderRendererMessage from "../Messages/IRenderRendererMessage";
import Framebuffer from "../Resource/FrameBuffer";
import IBufferUpdatedMessage from "../Messages/IBufferUpdatedMessage";
import CameraComponent from "./CameraComponent";
export default class RenderSceneComponent extends Component {
  public static attributes: { [key: string]: IAttributeDeclaration } = {
    layer: {
      converter: "String",
      defaultValue: "default"
    },
    depthBuffer: {
      defaultValue: undefined,
      converter: "String"
    },
    out: {
      converter: "String",
      defaultValue: "default"
    },
    clearColor: {
      defaultValue: "#0000",
      converter: "Color4",
    },
    clearColorEnabled: {
      defaultValue: true,
      converter: "Boolean",
    },
    clearDepthEnabled: {
      defaultValue: true,
      converter: "Boolean",
    },
    clearDepth: {
      defaultValue: 1.0,
      converter: "Number",
    },
    material: {
      defaultValue: undefined,
      converter: "Material",
      componentBoundTo: "_materialComponent"
    },
    camera: {
      defaultValue: undefined,
      converter: "Component",
      target: "CAMERA"
    }
  };

  private _gl: WebGLRenderingContext;

  private _canvas: HTMLCanvasElement;

  private _materialComponent: MaterialComponent;

  private _useMaterial: boolean = false;

  private _material: Material;

  private _materialArgs: { [key: string]: any } = {};

  private _fbo: Framebuffer;

  // backing fields

  private _layer: string;

  private _clearColor: Color4;

  private _clearColorEnabled: boolean;

  private _clearDepthEnabled: boolean;

  private _clearDepth: number;

  private _camera: CameraComponent;

  // messages

  public $awake(): void {
    this.getAttribute("layer").boundTo("_layer");
    this.getAttribute("clearColor").boundTo("_clearColor");
    this.getAttribute("clearColorEnabled").boundTo("_clearColorEnabled");
    this.getAttribute("clearDepthEnabled").boundTo("_clearDepthEnabled");
    this.getAttribute("clearDepth").boundTo("_clearDepth");
    this.getAttribute("camera").boundTo("_camera");
  }


  public $mount(): void {
    this._gl = this.companion.get("gl");
    this._canvas = this.companion.get("canvasElement");
    if (typeof this.getValue("material") !== "undefined") {
      this._onMaterialChanged();
      this._useMaterial = true;
    }
  }

  public $bufferUpdated(args: IBufferUpdatedMessage): void {
    const out = this.getValue("out");
    if (out !== "default") {
      this._fbo = new Framebuffer(this.companion.get("gl"));
      this._fbo.update(args.buffers[out]);
    }
    const depthBuffer = this.getValue("depthBuffer");
    if (depthBuffer && this._fbo) {
      this._fbo.update(args.buffers[depthBuffer]);
    }
  }

  public $render(args: IRenderRendererMessage): void {
    const camera = this._camera ? this._camera : args.camera;
    if (!camera) {
      return;
    }
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
    if (this._clearDepthEnabled) {
      this._gl.clearDepth(this._clearDepth);
      this._gl.clear(WebGLRenderingContext.DEPTH_BUFFER_BIT);
    }
    args.camera.renderScene(<IRenderSceneMessage>{
      camera: camera,
      buffers: args.buffers,
      layer: this._layer,
      viewport: args.viewport,
      material: this._useMaterial ? this._material : undefined,
      materialArgs: this._useMaterial ? this._materialArgs : undefined,
      loopIndex: args.loopIndex
    });
  }


  private _onMaterialChanged(): void {
    if (!this._materialComponent) { // the material must be instanciated by attribute.
      this._prepareInternalMaterial();
    } else {
      this._prepareExternalMaterial();
    }
  }

  private async _prepareExternalMaterial(): Promise<void> {
    const materialPromise = this.getValue("material") as Promise<Material>;
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

}
