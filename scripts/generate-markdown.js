import {
  glob,
  readFileAsync,
  templateAsync,
  writeFileAsync
} from 'grimoirejs-build-env-base';

import {
  getFileNameBody
} from "./pathUtil";

function* attributeWalker(attributes) {
  const regex = /(.+)[\s\n]*:[\s\n]*{([\s\S]+})/g;
  let regexResult;
  while ((regexResult = regex.exec(attributes))) {
    const target = regexResult[2];
    let j = 0;
    let bracketCount = 1;
    for (j = 0; j < target.length; j++) {
      const char = target.charAt(j);
      if (char === "{") {
        bracketCount++;
      } else if (char === "}") {
        bracketCount--;
      }
      if (bracketCount === 0) {
        break;
      }
    }
    regex.lastIndex = regex.lastIndex - target.length + j;
    yield {
      name: regexResult[1],
      body: regexResult[2].substr(0, j)
    }
  }
}

const fetchFiles = async() => {
  const files = await glob("./src/**/*Component.ts");
  for (let i = 0; i < files.length; i++) {
    let content = await readFileAsync(files[i]);
    let contentName = getFileNameBody(files[i]).match(/.+(?=Component)/)[0];
    console.log("content", contentName);
    const regex = /static[\s\n]+attributes[\s\n]*:[^}]*}[\s\n]*=[\s\n*]{([\s\S]+})/g;
    let result = regex.exec(content);
    const target = result[1];
    let bracketCount = 1;
    let j;
    for (j = 0; j < target.length; j++) {
      const char = target.charAt(j);
      if (char === "{") {
        bracketCount++;
      } else if (char === "}") {
        bracketCount--;
      }
      if (bracketCount === 0) {
        break;
      }
    }
    const attributes = target.substr(0, j);
    for (let attrs of attributeWalker(attributes)) {
      console.log(attrs.name);
      //console.log(`${attrs.name.trim()}:${attrs.body.trim()}`);
      await writeFileAsync('./lib-markdown/' + contentName + '.md', attrs);
    }
  }
}

fetchFiles();