import {glob,templateAsync,writeFileAsync,readFileAsync} from "grimoirejs-build-env-base";
import path from 'path';
const txt2js = async (globPath)=>{
  const globbedFiles = await glob(globPath);
  const dts = await readFileAsync("./scripts/templates/txt-d.ts.template");
  for(let fileName of globbedFiles){
    const genCode = await templateAsync("./scripts/templates/txt-js.template",{
      content:JSON.stringify((await readFileAsync(fileName)).toString('utf8'))
    });
    const fromSrc = path.relative("./src",fileName);
    await writeFileAsync("./lib/" + fromSrc + ".js",genCode);
    await writeFileAsync("./src/" + fromSrc + ".d.ts",dts);
  }
}

export default txt2js;
