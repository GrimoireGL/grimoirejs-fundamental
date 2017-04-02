const fs = require('fs')
const path = require('path')

function getDirectories (srcpath) {
  return fs.readdirSync(srcpath)
    .filter(file => fs.statSync(path.join(srcpath, file)).isDirectory())
}

const dir = process.env.CIRCLE_ARTIFACTS  || "ci_images";
const dirs = getDirectories("e2e");
console.log(dirs);
const exportModule = {};
for(let key of dirs){
  exportModule[key] = (client)=>{
    client
        .url(`http://localhost:8080/e2e/${key}/index.html`)
        .pause(100)
        .resizeWindow(640,480)
        .pause(100)
        .waitForElementPresent(`canvas.gr-resource-loaded-canvas`,5000)
        .pause(100)
        .saveScreenshot(dir + `/${key}.png`).end();
  };
}
module.exports = exportModule;
