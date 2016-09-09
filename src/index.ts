import DefaultPrimitives from "./Geometry/DefaultPrimitives";
//
// DO NOT REMOVE THE LINE BELOW.
//
import GrimoireInterface from "grimoirejs";

//<%=IMPORTS%>



GrimoireInterface.register(async () => {
  //<%=REGISTER%>
  GrimoireInterface.registerNode("goml", ["CanvasInitializer", "LoopManager", "AssetLoadingManager", "GeometryRegistory", "MaterialManager"]);
  GrimoireInterface.registerNode("renderers", ["RendererManager"]);
  GrimoireInterface.registerNode("renderer", ["Renderer"]);
  GrimoireInterface.registerNode("scene", ["Scene"]);
  GrimoireInterface.registerNode("camera", ["Transform", "Camera"]);
  GrimoireInterface.registerNode("empty", []);
  GrimoireInterface.registerNode("geometry", ["Geometry"]);
  GrimoireInterface.registerNode("texture", ["Texture"]);
  GrimoireInterface.registerNode("mesh", ["Transform", "MaterialContainer", "MeshRenderer"]);
  GrimoireInterface.registerNode("material", ["Material"]);
  GrimoireInterface.registerNode("import-material", ["MaterialImporter"]);
  GrimoireInterface.registerNode("backbuffer", ["BackBuffer"]);
  GrimoireInterface.registerNode("render-scene", ["MaterialContainer", "RenderScene"]);
  GrimoireInterface.registerNode("render-quad", ["MaterialContainer", "RenderQuad"]);
  DefaultPrimitives.register();
});
