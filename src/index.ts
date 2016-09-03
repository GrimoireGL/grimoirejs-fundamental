import PassFactory from "./Material/PassFactory";
import Material from "./Material/Material";
import MaterialFactory from "./Material/MaterialFactory";
import DefaultPrimitives from "./Geometry/DefaultPrimitives";
//
// DO NOT REMOVE THE LINE BELOW.
//
import GrimoireInterface from "grimoirejs";
import testShader from "./TestShader/Test.glsl";

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
  GrimoireInterface.registerNode("mesh", ["Transform", "MeshRenderer"]);
  GrimoireInterface.registerNode("material", ["Material"]);
  GrimoireInterface.registerNode("import-material", ["MaterialImporter"]);
  DefaultPrimitives.register();
});
