import TextureReference from "../Material/TextureReference";
import Attribute from "grimoirejs/lib/Node/Attribute";
import Texture2D from "../Resource/Texture2D";
import ImageResolver from "../Asset/ImageResolver";


function updateVideo(tex: Texture2D, video: HTMLVideoElement): void {
  tex.update(video);
  requestAnimationFrame(() => updateVideo(tex, video));
}
function _parseQuery(query: string): {
  type: string,
  param: string
} {
  const regex = /(query|backbuffer|video)\((.+)\)[^\)]*$/;
  let regexResult;
  if ((regexResult = regex.exec(query))) {
    return {
      type: regexResult[1],
      param: regexResult[2]
    }
  }
  return null;
}

function generateVideoTag(src: string): HTMLVideoElement {
  const vTag = document.createElement("video");
  vTag.src = src;
  return vTag;
}

function fromVideoTexture(gl: WebGLRenderingContext, val: HTMLVideoElement): Texture2D {
  const tex = new Texture2D(gl);
  val.play();
  tex.update(val);
  updateVideo(tex, val);
  return tex;
}



function TextureConverter(this: Attribute, val: any): any {
  if (val instanceof Texture2D) {
    return new TextureReference(val);
  }
  if (typeof val === "string") {
    const parseResult = _parseQuery(val);
    if (parseResult) {
      const param = parseResult.param;
      switch (parseResult.type) {
        case "backbuffer":
          return new TextureReference((buffers) => buffers[param]);
        case "video":
          return new TextureReference(fromVideoTexture(this.companion.get("gl"), generateVideoTag(param)))
      }
    } else {
      const tex = new Texture2D(this.companion.get("gl"));
      ImageResolver.resolve(val).then(t => {
        tex.update(t);
      });
      this.companion.get("loader").register(tex.validPromise);
      return new TextureReference(tex);
    }
  }
  if (typeof val === "object") {
    if (val instanceof HTMLImageElement) {
      const tex = new Texture2D(this.companion.get("gl"));
      if (val.complete && val.naturalWidth) {
        tex.update(val);
      } else {
        val.onload = function() {
          tex.update(val);
        };
      }
      return new TextureReference(tex);
    } else if (val instanceof HTMLCanvasElement) {
      const tex = new Texture2D(this.companion.get("gl"));
      tex.update(val);
      return new TextureReference(tex);
    } else if (val instanceof HTMLVideoElement) {
      return new TextureReference(fromVideoTexture(this.companion.get("gl"), val));
    }
  }
}

export default TextureConverter;
