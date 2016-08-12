import babelHelpers from 'babel-helpers';
import {
    glob
} from './build/globAsync';
import {
    getFileNameBody,
    getRelativePath
} from './build/pathUtil';
import {
    readFileAsync,
    templateAsync,
    execAsync,
    watchItr
} from './build/fsAsync';

import {
    rollup
} from 'rollup';
import npm from 'rollup-plugin-node-resolve';
import builtin from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import chalk from 'chalk';
import generate from './build/generate-index';
import {
    argv
} from 'yargs';

const buildTask = () => {
    return new Promise((resolve, reject) => {
        rollup({
            entry: './lib/index.js',
            plugins: [
                builtin(),
                commonjs({
                    ignoreGlobal: true,
                    exclude: ["node_modules/rollup-plugin-node-builtins/**", "node_modules/rollup-plugin-node-globals/**"] // https://github.com/calvinmetcalf/rollup-plugin-node-builtins/issues/5
                }),
                npm({
                    jsnext: true,
                    main: true,
                    browser: true
                }), globals()
            ]
        }).then(bundle => {
            resolve(bundle);
        }).catch(err => {
            reject(err);
        });
    });
};


const main = async() => {
    const config = JSON.parse(await readFileAsync("./package.json"));
    config.grimoire = config.grimoire ? config.grimoire : {};
    await generate(config);
    await execAsync("npm run compile");
    let bundle = null;
    try {
        bundle = await buildTask();
    } catch (e) {
        console.error(chalk.white.bgRed("COMPILATION FAILED"));
        console.error(chalk.red(e));
        console.error(chalk.yellow(e.stack));
        return;
    }
    console.log(chalk.white.bgBlue("COMPILATION SUCCESS"));
    bundle.write({
        format: 'cjs',
        dest: './product/index.es2016.js'
    });
    await execAsync("npm run bundle");
    console.log(chalk.white.bgGreen("BUNDLING FINISHED"));
}

const task = async() => {
    if (!argv.w) await main();
    else {
      console.log(chalk.white.bgGreen("WATCH MODE ENABLED"));
        for (let changedChunk of watchItr("./src", {
                interval: 500
            })) {
            await changedChunk;
            console.log(chalk.black.bgWhite("Change was detected. Building was started."))
            await main();
        }
    }
}

task();
