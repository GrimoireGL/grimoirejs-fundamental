import {
  copyDirAsync,
  readFileAsync,
  writeFileAsync,
  templateAsync,
  unlinkAsync,
  execAsync
} from './fsAsync';
import {
  glob
} from './globAsync';
import generate from './generate-index';


const main = async() => {
  const config = JSON.parse(await readFileAsync("./package.json"));
  config.grimoire = config.grimoire ? config.grimoire : {};
  await generate(config);
  await execAsync("npm run compile");
};

main();
