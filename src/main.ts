import RenderHitArea from "./Components/RenderStage/RenderHitareaComponent";
import NodeConverter from "./Converters/NodeConverter";
import PositionConverter from "./Converters/PositionConverter";
import DefaultPrimitives from "./Geometry/DefaultPrimitives";
import DefaultMaterial from "./Material/Defaults/DefaultMaterial";
import GLExtRequestor from "./Resource/GLExtRequestor";

import GrimoireInterface from "grimoirejs";
import AssetLoadingManagerComponent from "./Components/AssetLoadingManagerComponent";
import BasicComponent from "./Components/BasicComponent";
import CameraComponent from "./Components/CameraComponent";
import CanvasInitializerComponent from "./Components/CanvasInitializerComponent";
import CubemapCameraComponent from "./Components/CubemapCameraComponent";
import CubeRenderingTargetComponent from "./Components/CubeRenderingTargetComponent";
import Fullscreen from "./Components/FullscreenComponent";
import GeometryComponent from "./Components/GeometryComponent";
import GeometryRegistoryComponent from "./Components/GeometryRegistoryComponent";
import LoopManager from "./Components/LoopManagerComponent";
import Material from "./Components/MaterialComponent";
import MaterialContainer from "./Components/MaterialContainerComponent";
import MaterialImporter from "./Components/MaterialImporterComponent";
import MeshRendererComponent from "./Components/MeshRendererComponent";
import MouseCameraControlComponent from "./Components/MouseCameraControlComponent";
import RendererComponent from "./Components/RendererComponent";
import RendererManager from "./Components/RendererManagerComponent";
import RenderingTarget from "./Components/RenderingTargetComponent";
import RenderCubemapComponent from "./Components/RenderStage/RenderCubemapComponent";
import RenderQuadComponent from "./Components/RenderStage/RenderQuadComponent";
import RenderSceneComponent from "./Components/RenderStage/RenderSceneComponent";
import Scene from "./Components/SceneComponent";
import ColorBufferTextureCubeUpdator from "./Components/Texture/ColorBufferTextureCubeUpdator";
import ColorBufferTextureUpdator from "./Components/Texture/ColorBufferTextureUpdator";
import ConstantSizeResourceResizer from "./Components/Texture/ConstantSizeResourceResizer";
import ImageTextureUpdator from "./Components/Texture/ImageTextureUpdator";
import RenderBufferUpdator from "./Components/Texture/RenderBufferUpdator";
import TextureContainer from "./Components/Texture/TextureContainer";
import TextureCubeContainer from "./Components/Texture/TextureCubeContainer";
import VideoTextureUpdator from "./Components/Texture/VideoTextureUpdator";
import ViewportSizeResourceResizer from "./Components/Texture/ViewportSizeResourceResizer";
import Transform from "./Components/TransformComponent";
import CanvasSizeConverter from "./Converters/CanvasSizeConverter";
import GeometryConverter from "./Converters/GeometryConverter";
import MaterialConverter from "./Converters/MaterialConverter";
import RenderingTargetConverter from "./Converters/RenderingTargetConverter";
import TextureConverter from "./Converters/TextureConverter";
import TextureCubeConverter from "./Converters/TextureCubeConverter";
import ViewportConverter from "./Converters/ViewportConverter";

export default () => {
    GrimoireInterface.register(async () => {
        GrimoireInterface.registerComponent("AssetLoadingManager", AssetLoadingManagerComponent);
        GrimoireInterface.registerComponent("Camera", CameraComponent);
        GrimoireInterface.registerComponent("CubemapCamera", CubemapCameraComponent);
        GrimoireInterface.registerComponent("CanvasInitializer", CanvasInitializerComponent);
        GrimoireInterface.registerComponent("Fullscreen", Fullscreen);
        GrimoireInterface.registerComponent("Geometry", GeometryComponent);
        GrimoireInterface.registerComponent("GeometryRegistory", GeometryRegistoryComponent);
        GrimoireInterface.registerComponent("LoopManager", LoopManager);
        GrimoireInterface.registerComponent("Material", Material);
        GrimoireInterface.registerComponent("MaterialContainer", MaterialContainer);
        GrimoireInterface.registerComponent("MaterialImporter", MaterialImporter);
        GrimoireInterface.registerComponent("MeshRenderer", MeshRendererComponent);
        GrimoireInterface.registerComponent("MouseCameraControl", MouseCameraControlComponent);
        GrimoireInterface.registerComponent("RenderBufferUpdator", RenderBufferUpdator);
        GrimoireInterface.registerComponent("Renderer", RendererComponent);
        GrimoireInterface.registerComponent("RendererManager", RendererManager);
        GrimoireInterface.registerComponent("RenderQuad", RenderQuadComponent);
        GrimoireInterface.registerComponent("RenderCubemap", RenderCubemapComponent);
        GrimoireInterface.registerComponent("RenderScene", RenderSceneComponent);
        GrimoireInterface.registerComponent("Scene", Scene);
        GrimoireInterface.registerComponent("ColorBufferTextureUpdator", ColorBufferTextureUpdator);
        GrimoireInterface.registerComponent("ColorBufferTextureCubeUpdator", ColorBufferTextureCubeUpdator);
        GrimoireInterface.registerComponent("TextureContainer", TextureContainer);
        GrimoireInterface.registerComponent("TextureCubeContainer", TextureCubeContainer);
        GrimoireInterface.registerComponent("Transform", Transform);
        GrimoireInterface.registerComponent("RenderHitArea", RenderHitArea);
        GrimoireInterface.registerComponent("ImageTextureUpdator", ImageTextureUpdator);
        GrimoireInterface.registerComponent("VideoTextureUpdator", VideoTextureUpdator);
        GrimoireInterface.registerComponent("ViewportSizeResourceResizer", ViewportSizeResourceResizer);
        GrimoireInterface.registerComponent("ConstantSizeResourceResizer", ConstantSizeResourceResizer);
        GrimoireInterface.registerComponent("RenderingTarget", RenderingTarget);
        GrimoireInterface.registerComponent("CubeRenderingTarget", CubeRenderingTargetComponent);
        GrimoireInterface.registerComponent("BasicComponent", BasicComponent);

        GrimoireInterface.registerConverter("CanvasSize", CanvasSizeConverter);
        GrimoireInterface.registerConverter("Geometry", GeometryConverter);
        GrimoireInterface.registerConverter("Material", MaterialConverter);
        // TODO: remove Texture as deprecated Texture converter
        // Use Texture2D converter instead
        GrimoireInterface.registerConverter("Texture", TextureConverter);
        GrimoireInterface.registerConverter("Texture2D", TextureConverter);
        GrimoireInterface.registerConverter("TextureCube", TextureCubeConverter);
        GrimoireInterface.registerConverter("Viewport", ViewportConverter);
        GrimoireInterface.registerConverter("Node", NodeConverter);
        GrimoireInterface.registerConverter(PositionConverter);
        GrimoireInterface.registerConverter("RenderingTarget", RenderingTargetConverter);

        GrimoireInterface.registerNode("goml", ["CanvasInitializer", "LoopManager", "AssetLoadingManager", "GeometryRegistory", "RendererManager", "Fullscreen"]);
        GrimoireInterface.registerNode("scene", ["Scene"]);
        GrimoireInterface.registerNode("object", ["Transform"]);
        GrimoireInterface.registerNode("camera", ["Camera"], { position: "0,0,10" }, "object");
        GrimoireInterface.registerNode("cube-camera", ["CubemapCamera"], {
            aspect: 1,
            autoAspect: false,
            fovy: "90d",
        }, "object", ["aspect", "autoAspect"]);
        GrimoireInterface.registerNode("mesh", ["MaterialContainer", "MeshRenderer"], {}, "object");
        GrimoireInterface.registerNode("skybox", [], {
            geometry: "quad",
            material: "new(skybox)",
        }, "mesh");
        GrimoireInterface.registerNode("renderer", ["Renderer"]);
        GrimoireInterface.registerNode("geometry", ["Geometry"]);
        GrimoireInterface.registerNode("texture", ["TextureContainer"]);
        GrimoireInterface.registerNode("texture-cube", ["TextureCubeContainer"]);
        GrimoireInterface.registerNode("image-texture", ["ImageTextureUpdator"], {}, "texture");
        GrimoireInterface.registerNode("video-texture", ["VideoTextureUpdator"], {}, "texture");
        GrimoireInterface.registerNode("material", ["Material"]);
        GrimoireInterface.registerNode("import-material", ["MaterialImporter"]);
        GrimoireInterface.registerNode("color-buffer", ["ColorBufferTextureUpdator"], {
            resizerType: "ViewportSize",
        }, "texture");
        GrimoireInterface.registerNode("color-buffer-cube", ["ColorBufferTextureCubeUpdator"], {
            resizerType: "ViewportSize",
        }, "texture-cube");
        GrimoireInterface.registerNode("render-buffer", ["RenderBufferUpdator"], {
            resizerType: "ViewportSize",
        });
        GrimoireInterface.registerNode("render-scene", ["RenderScene", "RenderHitArea"], {
            material: null,
        });
        GrimoireInterface.registerNode("render-cubemap", ["RenderCubemap"], {
            material: null,
        });
        GrimoireInterface.registerNode("render-quad", ["MaterialContainer", "RenderQuad"], {
            material: null,
        });
        GrimoireInterface.registerNode("rendering-target", ["RenderingTarget"]);
        GrimoireInterface.registerNode("cube-rendering-target", ["CubeRenderingTarget"]);
        DefaultPrimitives.register();
        DefaultMaterial.register();
        GLExtRequestor.request("OES_texture_float");
    });
};
