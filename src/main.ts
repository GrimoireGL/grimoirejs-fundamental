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
import MaterialManagerComponent from "./Components/MaterialManagerComponent";
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
import Angle2DConverter from "./Converters/Angle2DConverter";
import BooleanConverter from "./Converters/BooleanConverter";
import CanvasSizeConverter from "./Converters/CanvasSizeConverter";
import Color3Converter from "./Converters/Color3Converter";
import Color4Converter from "./Converters/Color4Converter";
import ComponentConverter from "./Converters/ComponentConverter";
import EnumConverter from "./Converters/EnumConverter";
import GeometryConverter from "./Converters/GeometryConverter";
import MaterialConverter from "./Converters/MaterialConverter";
import TextureConverter from "./Converters/TextureConverter";
import NumberArrayConverter from "./Converters/NumberArrayConverter";
import NumberConverter from "./Converters/NumberConverter";
import ObjectConverter from "./Converters/ObjectConverter";
import Rotation3Converter from "./Converters/Rotation3Converter";
import StringArrayConverter from "./Converters/StringArrayConverter";
import StringConverter from "./Converters/StringConverter";
import Texture2DConverter from "./Converters/TextureConverter";
import Vector2Converter from "./Converters/Vector2Converter";
import Vector3Converter from "./Converters/Vector3Converter";
import Vector4Converter from "./Converters/Vector4Converter";
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
    GrimoireInterface.registerComponent(_$ns("MaterialManager"), MaterialManagerComponent);
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

    GrimoireInterface.registerConverter(_$ns("Angle2D"), Angle2DConverter);
    GrimoireInterface.registerConverter(_$ns("Boolean"), BooleanConverter);
    GrimoireInterface.registerConverter(_$ns("CanvasSize"), CanvasSizeConverter);
    GrimoireInterface.registerConverter(_$ns("Color3"), Color3Converter);
    GrimoireInterface.registerConverter(_$ns("Color4"), Color4Converter);
    GrimoireInterface.registerConverter(_$ns("Component"), ComponentConverter);
    GrimoireInterface.registerConverter(_$ns("Enum"), EnumConverter);
    GrimoireInterface.registerConverter(_$ns("Geometry"), GeometryConverter);
    GrimoireInterface.registerConverter(_$ns("Material"), MaterialConverter);
    GrimoireInterface.registerConverter(_$ns("Texture"), TextureConverter);
    GrimoireInterface.registerConverter(_$ns("NumberArray"), NumberArrayConverter);
    GrimoireInterface.registerConverter(_$ns("Number"), NumberConverter);
    GrimoireInterface.registerConverter(_$ns("Object"), ObjectConverter);
    GrimoireInterface.registerConverter(_$ns("Rotation3"), Rotation3Converter);
    GrimoireInterface.registerConverter(_$ns("StringArray"), StringArrayConverter);
    GrimoireInterface.registerConverter(_$ns("String"), StringConverter);
    GrimoireInterface.registerConverter(_$ns("Texture2D"), TextureConverter);
    GrimoireInterface.registerConverter(_$ns("Vector2"), Vector2Converter);
    GrimoireInterface.registerConverter(_$ns("Vector3"), Vector3Converter);
    GrimoireInterface.registerConverter(_$ns("Vector4"), Vector4Converter);
    GrimoireInterface.registerConverter(_$ns("Viewport"), ViewportConverter);

    GrimoireInterface.registerNode("goml", ["CanvasInitializer", "LoopManager", "AssetLoadingManager", "GeometryRegistory", "MaterialManager", "RendererManager", "Fullscreen"]);
    GrimoireInterface.registerNode("renderer", ["Renderer"]);
    GrimoireInterface.registerNode("scene", ["Scene"]);
    GrimoireInterface.registerNode("camera", ["Transform", "Camera"]);
    GrimoireInterface.registerNode("empty", []);
    GrimoireInterface.registerNode("object", ["Transform"]);
    GrimoireInterface.registerNode("geometry", ["Geometry"]);
    GrimoireInterface.registerNode("texture", ["Texture"]);
    GrimoireInterface.registerNode("mesh", ["Transform", "MaterialContainer", "MeshRenderer"]);
    GrimoireInterface.registerNode("material", ["Material"]);
    GrimoireInterface.registerNode("import-material", ["MaterialImporter"]);
    GrimoireInterface.registerNode("texture-buffer", ["TextureBuffer"]);
    GrimoireInterface.registerNode("render-buffer", ["RenderBuffer"]);
    GrimoireInterface.registerNode("render-scene", ["MaterialContainer", "RenderScene"], {
      material: null
    });
    GrimoireInterface.registerNode("render-quad", ["MaterialContainer", "RenderQuad"], {
      material: null
    });
    DefaultPrimitives.register();
    DefaultMaterial.register();
  });
};