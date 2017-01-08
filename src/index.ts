  import AssetAssetLoader from "./Asset/AssetLoader";
  import AssetCacheResolver from "./Asset/CacheResolver";
  import AssetExternalResourceResolver from "./Asset/ExternalResourceResolver";
  import AssetImageResolver from "./Asset/ImageResolver";
  import AssetTextFileResolver from "./Asset/TextFileResolver";
  import ComponentsAssetLoadingManagerComponent from "./Components/AssetLoadingManagerComponent";
  import ComponentsCameraComponent from "./Components/CameraComponent";
  import ComponentsCanvasInitializerComponent from "./Components/CanvasInitializerComponent";
  import ComponentsFullscreenComponent from "./Components/FullscreenComponent";
  import ComponentsGeometryComponent from "./Components/GeometryComponent";
  import ComponentsGeometryRegistoryComponent from "./Components/GeometryRegistoryComponent";
  import ComponentsHTMLBinderComponent from "./Components/HTMLBinderComponent";
  import ComponentsLoopManagerComponent from "./Components/LoopManagerComponent";
  import ComponentsMaterialComponent from "./Components/MaterialComponent";
  import ComponentsMaterialContainerComponent from "./Components/MaterialContainerComponent";
  import ComponentsMaterialImporterComponent from "./Components/MaterialImporterComponent";
  import ComponentsMeshRendererComponent from "./Components/MeshRendererComponent";
  import ComponentsMouseCameraControlComponent from "./Components/MouseCameraControlComponent";
  import ComponentsRenderBufferComponent from "./Components/RenderBufferComponent";
  import ComponentsRendererComponent from "./Components/RendererComponent";
  import ComponentsRendererManagerComponent from "./Components/RendererManagerComponent";
  import ComponentsRenderQuadComponent from "./Components/RenderQuadComponent";
  import ComponentsRenderSceneComponent from "./Components/RenderSceneComponent";
  import ComponentsSceneComponent from "./Components/SceneComponent";
  import ComponentsTextureBufferComponent from "./Components/TextureBufferComponent";
  import ComponentsTextureComponent from "./Components/TextureComponent";
  import ComponentsTransformComponent from "./Components/TransformComponent";
  import ConvertersCanvasSizeConverter from "./Converters/CanvasSizeConverter";
  import ConvertersGeometryConverter from "./Converters/GeometryConverter";
  import ConvertersMaterialConverter from "./Converters/MaterialConverter";
  import ConvertersNodeConverter from "./Converters/NodeConverter";
  import ConvertersPositionConverter from "./Converters/PositionConverter";
  import ConvertersTextureConverter from "./Converters/TextureConverter";
  import ConvertersViewportConverter from "./Converters/ViewportConverter";
  import GeometryDefaultPrimitives from "./Geometry/DefaultPrimitives";
  import GeometryGeometry from "./Geometry/Geometry";
  import GeometryGeometryFactory from "./Geometry/GeometryFactory";
  import GeometryGeometryUtility from "./Geometry/GeometryUtility";
  import MaterialDefaultMacro from "./Material/DefaultMacro";
  import MaterialDefaultMaterial from "./Material/DefaultMaterial";
  import MaterialMacroRegistory from "./Material/MacroRegistory";
  import MaterialMaterial from "./Material/Material";
  import MaterialMaterialFactory from "./Material/MaterialFactory";
  import MaterialPass from "./Material/Pass";
  import MaterialTechnique from "./Material/Technique";
  import MaterialTextureReference from "./Material/TextureReference";
  import MaterialUniformResolverRegistry from "./Material/UniformResolverRegistry";
  import MaterialUniformsMatricesRegister from "./Material/Uniforms/MatricesRegister";
  import MaterialUniformsMiscRegister from "./Material/Uniforms/MiscRegister";
  import MaterialUniformsUserValueRegister from "./Material/Uniforms/UserValueRegister";
  import ResourceBuffer from "./Resource/Buffer";
  import ResourceFrameBuffer from "./Resource/FrameBuffer";
  import ResourceGLExtRequestor from "./Resource/GLExtRequestor";
  import ResourceManagedProgram from "./Resource/ManagedProgram";
  import ResourceManagedShader from "./Resource/ManagedShader";
  import ResourceProgram from "./Resource/Program";
  import ResourceRenderBuffer from "./Resource/RenderBuffer";
  import ResourceResourceBase from "./Resource/ResourceBase";
  import ResourceResourceCache from "./Resource/ResourceCache";
  import ResourceShader from "./Resource/Shader";
  import ResourceTexture2D from "./Resource/Texture2D";
  import ResourceUniformProxy from "./Resource/UniformProxy";
  import SceneRendererDrawPriorty from "./SceneRenderer/DrawPriorty";
  import SceneRendererRenderQueue from "./SceneRenderer/RenderQueue";
  import SceneRendererRenderQueueRegistry from "./SceneRenderer/RenderQueueRegistry";
  import SortImportResolver from "./Sort/ImportResolver";
  import SortNameSemanticsPair from "./Sort/NameSemanticsPair";
  import SortParser from "./Sort/Parser";
  import SortPreferences from "./Sort/Preferences";
  import SortSortTransformUtility from "./Sort/SortTransformUtility";
  import SortTypeToConstant from "./Sort/TypeToConstant";
  import UtilHashCalculator from "./Util/HashCalculator";
  import UtilTextureSizeCalculator from "./Util/TextureSizeCalculator";
  import __INTERFACE__1 from "./Geometry/IGeometryFactoryDelegate";
  import __INTERFACE__2 from "./Geometry/IndexBufferInfo";
  import __INTERFACE__3 from "./Geometry/VertexBufferAccessor";
  import __INTERFACE__4 from "./Material/IMacro";
  import __INTERFACE__5 from "./Material/IMaterialArgument";
  import __INTERFACE__6 from "./Material/IPassRecipe";
  import __INTERFACE__7 from "./Material/IState";
  import __INTERFACE__8 from "./Material/ITechniqueRecipe";
  import __INTERFACE__9 from "./Material/IVariableInfo";
  import __INTERFACE__10 from "./Messages/IBufferUpdatedMessage";
  import __INTERFACE__11 from "./Messages/IRenderRendererMessage";
  import __INTERFACE__12 from "./Messages/IResizeBufferMessage";
  import __INTERFACE__13 from "./Objects/CanvasSizeObject";
  import __INTERFACE__14 from "./Objects/RenderSceneArgument";
  import __INTERFACE__15 from "./SceneRenderer/IRenderable";
  import __INTERFACE__16 from "./SceneRenderer/IRenderArgument";

var __VERSION__ = "0.11.0-beta9";
var __NAME__ = "grimoirejs-fundamental";

import __MAIN__ from "./main"

var __EXPOSE__ = {
  "Asset": {
    "AssetLoader": AssetAssetLoader,
    "CacheResolver": AssetCacheResolver,
    "ExternalResourceResolver": AssetExternalResourceResolver,
    "ImageResolver": AssetImageResolver,
    "TextFileResolver": AssetTextFileResolver
  },
  "Components": {
    "AssetLoadingManagerComponent": ComponentsAssetLoadingManagerComponent,
    "CameraComponent": ComponentsCameraComponent,
    "CanvasInitializerComponent": ComponentsCanvasInitializerComponent,
    "FullscreenComponent": ComponentsFullscreenComponent,
    "GeometryComponent": ComponentsGeometryComponent,
    "GeometryRegistoryComponent": ComponentsGeometryRegistoryComponent,
    "HTMLBinderComponent": ComponentsHTMLBinderComponent,
    "LoopManagerComponent": ComponentsLoopManagerComponent,
    "MaterialComponent": ComponentsMaterialComponent,
    "MaterialContainerComponent": ComponentsMaterialContainerComponent,
    "MaterialImporterComponent": ComponentsMaterialImporterComponent,
    "MeshRendererComponent": ComponentsMeshRendererComponent,
    "MouseCameraControlComponent": ComponentsMouseCameraControlComponent,
    "RenderBufferComponent": ComponentsRenderBufferComponent,
    "RendererComponent": ComponentsRendererComponent,
    "RendererManagerComponent": ComponentsRendererManagerComponent,
    "RenderQuadComponent": ComponentsRenderQuadComponent,
    "RenderSceneComponent": ComponentsRenderSceneComponent,
    "SceneComponent": ComponentsSceneComponent,
    "TextureBufferComponent": ComponentsTextureBufferComponent,
    "TextureComponent": ComponentsTextureComponent,
    "TransformComponent": ComponentsTransformComponent
  },
  "Converters": {
    "CanvasSizeConverter": ConvertersCanvasSizeConverter,
    "GeometryConverter": ConvertersGeometryConverter,
    "MaterialConverter": ConvertersMaterialConverter,
    "NodeConverter": ConvertersNodeConverter,
    "PositionConverter": ConvertersPositionConverter,
    "TextureConverter": ConvertersTextureConverter,
    "ViewportConverter": ConvertersViewportConverter
  },
  "Geometry": {
    "DefaultPrimitives": GeometryDefaultPrimitives,
    "Geometry": GeometryGeometry,
    "GeometryFactory": GeometryGeometryFactory,
    "GeometryUtility": GeometryGeometryUtility
  },
  "Material": {
    "DefaultMacro": MaterialDefaultMacro,
    "DefaultMaterial": MaterialDefaultMaterial,
    "MacroRegistory": MaterialMacroRegistory,
    "Material": MaterialMaterial,
    "MaterialFactory": MaterialMaterialFactory,
    "Pass": MaterialPass,
    "Technique": MaterialTechnique,
    "TextureReference": MaterialTextureReference,
    "UniformResolverRegistry": MaterialUniformResolverRegistry,
    "Uniforms": {
      "MatricesRegister": MaterialUniformsMatricesRegister,
      "MiscRegister": MaterialUniformsMiscRegister,
      "UserValueRegister": MaterialUniformsUserValueRegister
    }
  },
  "Resource": {
    "Buffer": ResourceBuffer,
    "FrameBuffer": ResourceFrameBuffer,
    "GLExtRequestor": ResourceGLExtRequestor,
    "ManagedProgram": ResourceManagedProgram,
    "ManagedShader": ResourceManagedShader,
    "Program": ResourceProgram,
    "RenderBuffer": ResourceRenderBuffer,
    "ResourceBase": ResourceResourceBase,
    "ResourceCache": ResourceResourceCache,
    "Shader": ResourceShader,
    "Texture2D": ResourceTexture2D,
    "UniformProxy": ResourceUniformProxy
  },
  "SceneRenderer": {
    "DrawPriorty": SceneRendererDrawPriorty,
    "RenderQueue": SceneRendererRenderQueue,
    "RenderQueueRegistry": SceneRendererRenderQueueRegistry
  },
  "Sort": {
    "ImportResolver": SortImportResolver,
    "NameSemanticsPair": SortNameSemanticsPair,
    "Parser": SortParser,
    "Preferences": SortPreferences,
    "SortTransformUtility": SortSortTransformUtility,
    "TypeToConstant": SortTypeToConstant
  },
  "Util": {
    "HashCalculator": UtilHashCalculator,
    "TextureSizeCalculator": UtilTextureSizeCalculator
  }
};

let __BASE__ = __MAIN__();

Object.assign(__EXPOSE__,{
    __VERSION__:__VERSION__,
    __NAME__:__NAME__
});
Object.assign(__BASE__|| {},__EXPOSE__);

window["GrimoireJS"].lib.fundamental = __EXPOSE__;

export default __BASE__;
