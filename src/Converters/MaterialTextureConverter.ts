import Attribute from "grimoirejs/lib/Node/Attribute";
import Texture2D from "../Resource/Texture2D";
import ImageResolver from "../Asset/ImageResolver";


function updateVideo(tex: Texture2D, video: HTMLVideoElement): void {
  tex.update(video);
  requestAnimationFrame(() => updateVideo(tex, video));
}

function MaterialTextureConverter(this: Attribute, val: any): any {
  if (val instanceof Texture2D) {
    return () => val;
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
    });
    this.companion.get("loader").register(tex.validPromise);
    return () => tex;
  }
  if (typeof val === "object") {
    if (val instanceof HTMLImageElement) {
      const tex = new Texture2D(this.companion.get("gl"));
      if (val.complete && val.naturalWidth) {
        tex.update(val);
        return () => tex;
      } else {
        val.onload = function() {
          tex.update(val);
        };
        return () => tex;
      }
    } else if (val instanceof HTMLCanvasElement) {
      const tex = new Texture2D(this.companion.get("gl"));
      tex.update(val);
      return () => tex;
    } else if (val instanceof HTMLVideoElement) {
      const tex = new Texture2D(this.companion.get("gl"));
      val.play();
      tex.update(val);
      updateVideo(tex, val);
      return () => tex;
    }
  }
}

export default MaterialTextureConverter;
