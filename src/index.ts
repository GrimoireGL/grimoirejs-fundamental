import "babel-polyfill";
//
// DO NOT REMOVE THE LINE BELOW.
//
import GrimoireInterface from "grimoirejs";
//<%=IMPORTS%>

GrimoireInterface.register(async () => {
  //<%=REGISTER%>
  GrimoireInterface.registerNode("goml", ["CanvasInitializer", "LoopManager", "AssetLoadingManager"]);
  GrimoireInterface.registerNode("renderers", ["RendererManager"]);
  GrimoireInterface.registerNode("renderer", ["Renderer"]);
  GrimoireInterface.registerNode("scenes", ["SceneManager"]);
  GrimoireInterface.registerNode("scene", ["Scene"]);
  GrimoireInterface.registerNode("camera", ["Camera"]);
  GrimoireInterface.registerNode("empty", []);
  GrimoireInterface.registerNode("mesh", ["MeshRenderer"]);
});
