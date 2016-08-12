/// <reference path="../src/typings/index.d.ts"/>
import "babel-polyfill";
//
// DO NOT REMOVE THE LINE BELOW.
//
import GrimoireInterface from "grimoirejs";
//<%=IMPORTS%>

GrimoireInterface.register(async () => {
    //<%=REGISTER%>
    GrimoireInterface.registerNode("goml", ["CanvasInitializer"]);
});
