import TextureComponent from "../Components/TextureComponent";
import gr from "grimoirejs";
import TextureReference from "../Material/TextureReference";
import Attribute from "grimoirejs/ref/Node/Attribute";
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



export default function TextureConverter(val: any, attr: Attribute): any {
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
          return new TextureReference(fromVideoTexture(attr.companion.get("gl"), generateVideoTag(param)))
        case "query":
          const obtainedTag = attr.tree(param);
          const texture = obtainedTag.first().getComponent(TextureComponent);
          return new TextureReference(() => texture.texture);
      }
    } else {
      const tex = new Texture2D(attr.companion.get("gl"));
      ImageResolver.resolve(val).then(t => {
        tex.update(t);
      });
      attr.companion.get("loader").register(tex.validPromise);
      return new TextureReference(tex);
    }
  }
  if (typeof val === "object") {
    if (val instanceof HTMLImageElement) {
      const tex = new Texture2D(attr.companion.get("gl"));
      if (val.complete && val.naturalWidth) {
        tex.update(val);
      } else {
        val.onload = function() {
          tex.update(val);
        };
      }
      return new TextureReference(tex);
    } else if (val instanceof HTMLCanvasElement) {
      const tex = new Texture2D(attr.companion.get("gl"));
      tex.update(val);
      return new TextureReference(tex);
    } else if (val instanceof HTMLVideoElement) {
      return new TextureReference(fromVideoTexture(attr.companion.get("gl"), val));
    }
  }
  return null;
}
