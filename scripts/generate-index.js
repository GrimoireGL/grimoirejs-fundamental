import {
    copyDirAsync,
    readFileAsync,
    writeFileAsync,
    templateAsync,
    unlinkAsync,
    execAsync,
    emptyDir,
    glob
} from 'grimoirejs-build-env-base';
import {
    getFileNameBody,
    getRelativePath
} from './pathUtil';
import txt2js from './txt2js';


export default async function(config) {
    await copyDirAsync('./src', './lib-ts', true);
    let index = await readFileAsync('./src/index.ts');
    // glob component files
    const componentFiles = await glob('./src/**/*Component.ts');
    const components = componentFiles.map(v => {
        const nameBody = getFileNameBody(v);
        const tag = nameBody.replace(/^(.+)Component$/, "$1");
        if (!tag) {
            console.error("The name just 'Component' is prohibited for readability");
        }
        return {
            tag: tag,
            key: nameBody,
            path: getRelativePath(v)
        };
    });
    // glob converter files
    const converterFiles = await glob('./src/**/*Converter.ts');
    const converters = converterFiles.map(v => {
        const nameBody = getFileNameBody(v);
        const tag = nameBody.replace(/^(.+)Converter$/, "$1");
        if (!tag) {
            console.error("The name just 'Component' is prohibited for readability");
        }
        return {
            tag: tag,
            key: nameBody,
            path: getRelativePath(v)
        };
    });
    const imports = await templateAsync("./scripts/templates/imports.template", {
        externals: config.grimoire.dependencies,
        components: components,
        converters: converters
    });
    const register = await templateAsync("./scripts/templates/register.template", {
        namespace: config.grimoire.namespace ? config.grimoire.namespace : "HTTP://GRIMOIRE.GL/NS/CUSTOM",
        components: components,
        converters: converters
    });
    index = index.replace(/^\s*\/\/\<\%\=IMPORTS\%\>\s*$/m, imports);
    index = index.replace(/^\s*\/\/\<\%\=REGISTER\%\>\s*$/m, register);
    await unlinkAsync('./lib-ts/index.ts');
    await writeFileAsync('./lib-ts/index.ts', index);
    await emptyDir('./lib-ts/typings');
    const files = await glob('./lib-ts/**/*.ts');
    await writeFileAsync('./lib-ts/entry_files', files.join('\n'));
    if(config.grimoire.txt2js){
        const exts = config.grimoire.txt2js;
        for (var i = 0; i < exts.length; i++) {
          await txt2js("./src/**/" + exts[i]);
        }
    }

}
