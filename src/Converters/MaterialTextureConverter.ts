import Texture2D from "../Resource/Texture2D";
import ImageResolver from "../Asset/ImageResolver";

function MaterialTextureConverter(val: any): any {
  if (val instanceof Texture2D) {
    return val;
  }
  if (typeof val === "string") {
    const queryRegex = /^query\((.*)\)$/m;
    let regexResult: RegExpExecArray;
    // Query texture element
    if ((regexResult = queryRegex.exec(val))) {
      const queried = this.tree(regexResult[1]);
      throw new Error("Not implemeneted yet");
    }
    // from backbuffer
    const backbufferRegex = /^backbuffer\((.*)\)$/m;
    if ((regexResult = backbufferRegex.exec(val))) {
      return (buffers) => buffers[regexResult[1]];
    }
    const tex = new Texture2D(this.companion.get("gl"));
    ImageResolver.resolve(val).then(t => {
      tex.update(t);
    })
    return () => tex;
  }
}

export default MaterialTextureConverter;
