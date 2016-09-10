const xmldom = require("xmldom");
const chalk = require("chalk");
global.DOMParser = xmldom.DOMParser;
const Module = module.constructor;
const require0 = Module.prototype.require;
const regexRoot = /^grimoirejs[^\/]*$/m;
const regexInternal = /^(grimoirejs[^\/]*)\/lib\//m;

Module.prototype.require = function(path){
  let converted = false;
  if(regexRoot.test(path)){ // import SOMETHING from "grimoirejs**" -> grimoirejs**/lib-es5/index
    path += "/lib-es5/index";
    converted = true;
  }
  if(regexInternal.test(path)){ // import SOMETHING from "grimoirejs**/lib/#### -> grimoirejs**/lib-es5/####
    path = path.replace(regexInternal,"$1/lib-es5/");
    converted = true;
  }
	return require0.call(this, path);
};
