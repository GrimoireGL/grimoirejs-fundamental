import DefaultPrimitives from "./Geometry/DefaultPrimitives";
//
// DO NOT REMOVE THE LINE BELOW.
//
import GrimoireInterface from "grimoirejs";
//<%=IMPORTS%>

GrimoireInterface.register(async () => {
  //<%=REGISTER%>
  GrimoireInterface.registerNode("goml", ["CanvasInitializer", "LoopManager", "AssetLoadingManager", "GeometryRegistory"]);
  GrimoireInterface.registerNode("renderers", ["RendererManager"]);
  GrimoireInterface.registerNode("renderer", ["Renderer"]);
  GrimoireInterface.registerNode("scenes", ["SceneManager"]);
  GrimoireInterface.registerNode("scene", ["Scene"]);
  GrimoireInterface.registerNode("camera", ["Transform", "Camera"]);
  GrimoireInterface.registerNode("empty", []);
  GrimoireInterface.registerNode("geometry", ["Geometry"]);
  GrimoireInterface.registerNode("texture", ["Texture"]);
  GrimoireInterface.registerNode("mesh", ["Transform", "MeshRenderer"]);
  GrimoireInterface.registerNode("material", ["Material"]);
  DefaultPrimitives.register();
});
