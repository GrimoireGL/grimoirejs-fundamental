import TimeComponent from "./Components/TimeComponent";
import RenderHitArea from "./Components/RenderHitareaComponent";
import PositionConverter from "./Converters/PositionConverter";
import NodeConverter from "./Converters/NodeConverter";
import DefaultMaterial from "./Material/DefaultMaterial";
import GLExtRequestor from "./Resource/GLExtRequestor";
import DefaultPrimitives from "./Geometry/DefaultPrimitives";
//
// DO NOT REMOVE THE LINE BELOW.
//
import GrimoireInterface from "grimoirejs";
import AssetLoadingManagerComponent from "./Components/AssetLoadingManagerComponent";
import CameraComponent from "./Components/CameraComponent";
import CanvasInitializerComponent from "./Components/CanvasInitializerComponent";
import FullscreenComponent from "./Components/FullscreenComponent";
import GeometryComponent from "./Components/GeometryComponent";
import GeometryRegistoryComponent from "./Components/GeometryRegistoryComponent";
import HTMLBinderComponent from "./Components/HTMLBinderComponent";
import LoopManagerComponent from "./Components/LoopManagerComponent";
import MaterialComponent from "./Components/MaterialComponent";
import MaterialContainerComponent from "./Components/MaterialContainerComponent";
import MaterialImporterComponent from "./Components/MaterialImporterComponent";
import MeshRendererComponent from "./Components/MeshRendererComponent";
import MouseCameraControlComponent from "./Components/MouseCameraControlComponent";
import RenderBufferComponent from "./Components/RenderBufferComponent";
import RendererComponent from "./Components/RendererComponent";
import RendererManagerComponent from "./Components/RendererManagerComponent";
import RenderQuadComponent from "./Components/RenderQuadComponent";
import RenderSceneComponent from "./Components/RenderSceneComponent";
import SceneComponent from "./Components/SceneComponent";
import TextureBufferComponent from "./Components/TextureBufferComponent";
import TextureComponent from "./Components/TextureComponent";
import TransformComponent from "./Components/TransformComponent";
import CanvasSizeConverter from "./Converters/CanvasSizeConverter";
import GeometryConverter from "./Converters/GeometryConverter";
import MaterialConverter from "./Converters/MaterialConverter";
import TextureConverter from "./Converters/TextureConverter";
import Texture2DConverter from "./Converters/TextureConverter";
import ViewportConverter from "./Converters/ViewportConverter";

export default () => {
  GrimoireInterface.register(async () => {
    const _$ns = GrimoireInterface.ns("HTTP://GRIMOIRE.GL/NS/DEFAULT");
    GrimoireInterface.registerComponent(_$ns("AssetLoadingManager"), AssetLoadingManagerComponent);
    GrimoireInterface.registerComponent(_$ns("Camera"), CameraComponent);
    GrimoireInterface.registerComponent(_$ns("CanvasInitializer"), CanvasInitializerComponent);
    GrimoireInterface.registerComponent(_$ns("Fullscreen"), FullscreenComponent);
    GrimoireInterface.registerComponent(_$ns("Geometry"), GeometryComponent);
    GrimoireInterface.registerComponent(_$ns("GeometryRegistory"), GeometryRegistoryComponent);
    GrimoireInterface.registerComponent(_$ns("HTMLBinder"), HTMLBinderComponent);
    GrimoireInterface.registerComponent(_$ns("LoopManager"), LoopManagerComponent);
    GrimoireInterface.registerComponent(_$ns("Material"), MaterialComponent);
    GrimoireInterface.registerComponent(_$ns("MaterialContainer"), MaterialContainerComponent);
    GrimoireInterface.registerComponent(_$ns("MaterialImporter"), MaterialImporterComponent);
    GrimoireInterface.registerComponent(_$ns("MeshRenderer"), MeshRendererComponent);
    GrimoireInterface.registerComponent(_$ns("MouseCameraControl"), MouseCameraControlComponent);
    GrimoireInterface.registerComponent(_$ns("RenderBuffer"), RenderBufferComponent);
    GrimoireInterface.registerComponent(_$ns("Renderer"), RendererComponent);
    GrimoireInterface.registerComponent(_$ns("RendererManager"), RendererManagerComponent);
    GrimoireInterface.registerComponent(_$ns("RenderQuad"), RenderQuadComponent);
    GrimoireInterface.registerComponent(_$ns("RenderScene"), RenderSceneComponent);
    GrimoireInterface.registerComponent(_$ns("Scene"), SceneComponent);
    GrimoireInterface.registerComponent(_$ns("TextureBuffer"), TextureBufferComponent);
    GrimoireInterface.registerComponent(_$ns("Texture"), TextureComponent);
    GrimoireInterface.registerComponent(_$ns("Transform"), TransformComponent);
    GrimoireInterface.registerComponent(_$ns("RenderHitArea"), RenderHitArea);
    GrimoireInterface.registerComponent(_$ns("Time"), TimeComponent);

    GrimoireInterface.registerConverter(_$ns("CanvasSize"), CanvasSizeConverter);
    GrimoireInterface.registerConverter(_$ns("Geometry"), GeometryConverter);
    GrimoireInterface.registerConverter(_$ns("Material"), MaterialConverter);
    GrimoireInterface.registerConverter(_$ns("Texture"), TextureConverter);
    GrimoireInterface.registerConverter(_$ns("Texture2D"), TextureConverter);
    GrimoireInterface.registerConverter(_$ns("Viewport"), ViewportConverter);
    GrimoireInterface.registerConverter(_$ns("Node"), NodeConverter);
    GrimoireInterface.registerConverter(PositionConverter);

    GrimoireInterface.registerNode("goml", ["CanvasInitializer", "LoopManager", "AssetLoadingManager", "GeometryRegistory", "RendererManager", "Fullscreen"]);
    GrimoireInterface.registerNode("scene", ["Scene","Time"]);
    GrimoireInterface.registerNode("object", ["Transform"]);
    GrimoireInterface.registerNode("camera", ["Camera"], { position: "0,0,10" }, "object");
    GrimoireInterface.registerNode("mesh", ["MaterialContainer", "MeshRenderer"], {}, "object");
    GrimoireInterface.registerNode("renderer", ["Renderer"]);

    GrimoireInterface.registerNode("geometry", ["Geometry"]);
    GrimoireInterface.registerNode("texture", ["Texture"]);
    GrimoireInterface.registerNode("material", ["Material"]);
    GrimoireInterface.registerNode("import-material", ["MaterialImporter"]);
    GrimoireInterface.registerNode("texture-buffer", ["TextureBuffer"]);
    GrimoireInterface.registerNode("render-buffer", ["RenderBuffer"]);
    GrimoireInterface.registerNode("render-scene", ["RenderScene", "RenderHitArea"], {
      material: null
    });
    GrimoireInterface.registerNode("render-quad", ["MaterialContainer", "RenderQuad"], {
      material: null
    });
    DefaultPrimitives.register();
    DefaultMaterial.register();
  });
};
