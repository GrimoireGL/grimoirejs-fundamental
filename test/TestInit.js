const xmldom = require("xmldom");
global.DOMParser = xmldom.DOMParser;
global.WebGLRenderingContext = {};
global.window = {
  addEventListener:function(){}
};
require("regenerator-runtime/runtime");
require("grimoirejs/register");
require("grimoirejs-math/register");
