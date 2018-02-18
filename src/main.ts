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
import GeometryRegistryComponent from "./Components/GeometryRegistryComponent";
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
import MeshRenderer from "./Components/MeshRendererComponent";
import Geometry from "./Geometry/Geometry";
import MaterialComponent from "./Components/MaterialComponent";
import RenderHitareaComponent from "./Components/RenderStage/RenderHitareaComponent";
import SkyboxManager from "./Components/SkyboxManager";

export default () => {
    GrimoireInterface.register(async () => {
        GrimoireInterface.registerComponent(AssetLoadingManagerComponent);
        GrimoireInterface.registerComponent(CameraComponent);
        GrimoireInterface.registerComponent(CubemapCameraComponent);
        GrimoireInterface.registerComponent(CanvasInitializerComponent);
        GrimoireInterface.registerComponent(Fullscreen);
        GrimoireInterface.registerComponent(GeometryComponent);
        GrimoireInterface.registerComponent(GeometryRegistryComponent);
        GrimoireInterface.registerComponent(LoopManager);
        GrimoireInterface.registerComponent(Material);
        GrimoireInterface.registerComponent(MaterialContainer);
        GrimoireInterface.registerComponent(MaterialImporter);
        GrimoireInterface.registerComponent(MeshRendererComponent);
        GrimoireInterface.registerComponent(MouseCameraControlComponent);
        GrimoireInterface.registerComponent(RenderBufferUpdator);
        GrimoireInterface.registerComponent(RendererComponent);
        GrimoireInterface.registerComponent(RendererManager);
        GrimoireInterface.registerComponent(RenderQuadComponent);
        GrimoireInterface.registerComponent(RenderCubemapComponent);
        GrimoireInterface.registerComponent(RenderSceneComponent);
        GrimoireInterface.registerComponent(Scene);
        GrimoireInterface.registerComponent(ColorBufferTextureUpdator);
        GrimoireInterface.registerComponent(ColorBufferTextureCubeUpdator);
        GrimoireInterface.registerComponent(TextureContainer);
        GrimoireInterface.registerComponent(TextureCubeContainer);
        GrimoireInterface.registerComponent(Transform);
        GrimoireInterface.registerComponent(RenderHitArea);
        GrimoireInterface.registerComponent(ImageTextureUpdator);
        GrimoireInterface.registerComponent(VideoTextureUpdator);
        GrimoireInterface.registerComponent(ViewportSizeResourceResizer);
        GrimoireInterface.registerComponent(ConstantSizeResourceResizer);
        GrimoireInterface.registerComponent(RenderingTarget);
        GrimoireInterface.registerComponent(CubeRenderingTargetComponent);
        GrimoireInterface.registerComponent(BasicComponent);
        GrimoireInterface.registerComponent(SkyboxManager);

        GrimoireInterface.registerConverter(CanvasSizeConverter);
        GrimoireInterface.registerConverter(GeometryConverter);
        GrimoireInterface.registerConverter(MaterialConverter);
        // TODO: remove Texture as deprecated Texture converter
        // Use Texture2D converter instead
        GrimoireInterface.registerConverter(TextureConverter);
        GrimoireInterface.registerConverter(TextureConverter);
        GrimoireInterface.registerConverter(TextureCubeConverter);
        GrimoireInterface.registerConverter(ViewportConverter);
        GrimoireInterface.registerConverter(NodeConverter);
        GrimoireInterface.registerConverter(PositionConverter);
        GrimoireInterface.registerConverter(RenderingTargetConverter);

        GrimoireInterface.registerNode("goml", [CanvasInitializerComponent, LoopManager, AssetLoadingManagerComponent, GeometryRegistryComponent, RendererManager, Fullscreen]);
        GrimoireInterface.registerNode("scene", [Scene]);
        GrimoireInterface.registerNode("object", [Transform]);
        GrimoireInterface.registerNode("camera", [CameraComponent], { position: "0,0,10" }, "object");
        GrimoireInterface.registerNode("cube-camera", [CubemapCameraComponent], {
            aspect: 1,
            autoAspect: false,
            fovy: "90d",
        }, "object", ["aspect", "autoAspect"]);
        GrimoireInterface.registerNode("mesh", [MaterialContainer, MeshRenderer], {}, "object");
        GrimoireInterface.registerNode("skybox", [SkyboxManager], {
            geometry: "quad",
            material: "new(skybox)",
        }, "mesh");
        GrimoireInterface.registerNode("renderer", [RendererComponent]);
        GrimoireInterface.registerNode("geometry", [GeometryComponent]);
        GrimoireInterface.registerNode("texture", [TextureContainer]);
        GrimoireInterface.registerNode("texture-cube", [TextureCubeContainer]);
        GrimoireInterface.registerNode("image-texture", [ImageTextureUpdator], {}, "texture");
        GrimoireInterface.registerNode("video-texture", [VideoTextureUpdator], {}, "texture");
        GrimoireInterface.registerNode("material", [MaterialComponent]);
        GrimoireInterface.registerNode("import-material", [MaterialImporter]);
        GrimoireInterface.registerNode("color-buffer", [ColorBufferTextureUpdator], {
            resizerType: "ViewportSize",
        }, "texture");
        GrimoireInterface.registerNode("color-buffer-cube", [ColorBufferTextureCubeUpdator], {
            resizerType: "ViewportSize",
        }, "texture-cube");
        GrimoireInterface.registerNode("render-buffer", [RenderBufferUpdator], {
            resizerType: "ViewportSize",
        });
        GrimoireInterface.registerNode("render-scene", [RenderSceneComponent, RenderHitareaComponent], {
            material: null,
        });
        GrimoireInterface.registerNode("render-cubemap", [RenderCubemapComponent], {
            material: null,
        });
        GrimoireInterface.registerNode("render-quad", [MaterialContainer, RenderQuadComponent], {
            material: null,
        });
        GrimoireInterface.registerNode("rendering-target", [RenderingTarget]);
        GrimoireInterface.registerNode("cube-rendering-target", [CubeRenderingTargetComponent]);
        DefaultPrimitives.register();
        DefaultMaterial.register();
        GLExtRequestor.request("OES_texture_float");
    });
};
