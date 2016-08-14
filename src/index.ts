/// <reference path="../src/typings/index.d.ts"/>
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
  GrimoireInterface.registerNode("renderer", []);
  GrimoireInterface.registerNode("scenes", []);
  GrimoireInterface.registerNode("scene", []);
  GrimoireInterface.registerNode("empty", []);
});
