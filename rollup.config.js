import babelHelpers from 'babel-helpers';
import {
    getFileNameBody,
    getRelativePath
} from './scripts/pathUtil';
import {
    readFileAsync,
    templateAsync,
    execAsync,
    watchItr,
    glob
} from 'grimoirejs-build-env-base';

import {
    rollup
} from 'rollup';
import npm from 'rollup-plugin-node-resolve';
import builtin from 'rollup-plugin-node-builtins';
import commonjs from 'rollup-plugin-commonjs';
import globals from 'rollup-plugin-node-globals';
import sourcemaps from 'rollup-plugin-sourcemaps';
import inject from 'rollup-plugin-inject';
import chalk from 'chalk';
import generate from './scripts/generate-index';
import {
    argv
} from 'yargs';
import ProgressBar from 'progress';

const bundlingTask = () => {
    return new Promise((resolve, reject) => {
        rollup({
            entry: './lib/index.js',
            sourceMap: true,
            plugins: [
                sourcemaps(),
                inject({
                    modules: {
                        __awaiter: 'typescript-awaiter'
                    }
                }),
                builtin(),
                commonjs({
                    ignoreGlobal: true,
                    exclude: ["node_modules/rollup-plugin-node-builtins/**", "node_modules/rollup-plugin-node-globals/**"] // https://github.com/calvinmetcalf/rollup-plugin-node-builtins/issues/5
                }),
                npm({
                    jsnext: true,
                    main: true,
                    browser: true
                })
            ]
        }).then(bundle => {
            resolve(bundle);
        }).catch(err => {
            reject(err);
        });
    });
};

const parseConfig = async() => {
    const config = JSON.parse(await readFileAsync("./package.json"));
    config.grimoire = config.grimoire ? config.grimoire : {};
    return config;
};
const barLength = 50;

let taskCount = 4;
if (argv.b) {
    taskCount++;
}
if (argv.m) {
    taskCount++;
}

const tickBar = (bar, message) => {
    bar.fmt = `:percent[:bar](${message})\n`;
    bar.tick(barLength / taskCount);
};

if(!argv.b && argv.m){
  console.warn("You cannnot minify es2016 script. minify task will be skipped");
  taskCount --;
}


const main = async() => {
    const bar = new ProgressBar(':bar\nParsing config file...\n', {
        total: barLength
    });
    const config = await parseConfig();
    tickBar(bar, "Generating code from template...");
    await generate(config);
    tickBar(bar, "Compiling typescript files...");
    const tsResult = await execAsync("npm run compile");
    if (tsResult.err) {
        console.log(chalk.red(tsResult.stdout));
        return;
    }
    tickBar(bar, "Bundling es2016 javascript files...");
    let bundle = null;
    try {
        bundle = await bundlingTask();
    } catch (e) {
        console.error(chalk.white.bgRed("BUNDLING FAILED"));
        console.error(chalk.red(e));
        console.error(chalk.yellow(e.stack));
        return;
    }
    bundle.write({
        format: 'cjs',
        sourceMap: true,
        dest: './product/index.es2016.js'
    });
    if (argv.b) {
        tickBar(bar, "Transpiling into es2015 javascript files...");
        await execAsync("npm run babel");
    }
    if (argv.m && argv.b) {
        tickBar(bar, "Uglifying generated javascript");
        await execAsync("npm run minify");
    }
    tickBar(bar, "DONE!");
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

const server = async() => {
    const serverLog = await execAsync("npm run serve");
    if (serverLog.err) {
        console.error(chalk.red(serverLog.stderr));
    }
}

task();
if (argv.s) {
    server();
}
