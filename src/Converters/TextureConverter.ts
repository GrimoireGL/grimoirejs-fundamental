import TextureComponent from "../Components/TextureComponent";
import TextureReference from "../Material/TextureReference";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Texture2D from "../Resource/Texture2D";
import ImageResolver from "../Asset/ImageResolver";
import {Nullable} from "grimoirejs/ref/Base/Types";

type Query = {
  type: "query" | "backbuffer" | "video",
  param: string
};

function updateVideo(tex: Texture2D, video: HTMLVideoElement): void {
  tex.update(video);
  requestAnimationFrame(() => updateVideo(tex, video));
}
function _parseQuery(query: string): Nullable<Query> {
  const regex = /(query|backbuffer|video)\((.+)\)[^\)]*$/;
  let regexResult;
  if ((regexResult = regex.exec(query))) {
    return {
      type: regexResult[1] as "query" | "backbuffer" | "video",
      param: regexResult[2]
    };
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

/**
 * テクスチャへの参照を取得するためのコンバーター
 * 渡すものが文字列である場合、4つの方法がある。
 * * `url`・・・指定したアドレスから画像を解決して取得する
 * * `backbuffer(バックバッファ名)`・・・名前付きバックバッファのリストから取得する
 * * `video(ビデオファイルへのURL)`・・・指定したアドレスからビデオを取得してテクスチャとして再生する(deprecated)
 * * `query(<texture>へのクエリ)`・・・指定したクエリで`<texture>`を探索して利用する。
 * 渡すものがオブジェクトである場合、5つの方法がある。
 * * `Texture2D型`・・・そのまま利用される
 * * `HTMLImageElement`・・・必要がある場合リサイズされた上で利用される。(自動的に2の累乗に変換される)
 * * `HTMLCanvasElement`・・・必要がある場合リサイズされた上で利用される。(自動的に2の累乗に変換される)
 * * `HTMLVideoElement`・・・必要がある場合リサイズされた上で、自動的に再生される(自動的に2の累乗に変換される)
 */
export default function TextureConverter(val: any, attr: Attribute): any {
  if (val instanceof Texture2D) {
    return new TextureReference(val);
  } else if (val instanceof TextureReference) {
    return val;
  } else if (typeof val === "string") {
    const parseResult = _parseQuery(val);
    if (parseResult) {
      const param = parseResult.param;
      switch (parseResult.type) {
        case "backbuffer":
          return new TextureReference((buffers) => buffers[param]);
        case "video":
          console.warn(`The syntax "video(URL)" is deprecated after version 0.16.0.\n You should use <video-texture> tag instead.`);
          return new TextureReference(fromVideoTexture(attr.companion!.get("gl"), generateVideoTag(param)));
        case "query":
          const obtainedTag = attr.tree!(param);
          const texture = obtainedTag.first()!.getComponent(TextureComponent);
          return new TextureReference(() => texture.texture);
      }
    } else {
      const tex = new Texture2D(attr.companion!.get("gl"));
      ImageResolver.resolve(val).then(t => {
        tex.update(t);
      });
      attr.companion!.get("loader").register(tex.validPromise);
      return new TextureReference(tex);
    }
  }
  if (typeof val === "object") {
    if (val instanceof HTMLImageElement) {
      const tex = new Texture2D(attr.companion!.get("gl"));
      if (val.complete && val.naturalWidth) {
        tex.update(val);
      } else {
        val.onload = function() {
          tex.update(val);
        };
      }
      return new TextureReference(tex);
    } else if (val instanceof HTMLCanvasElement) {
      const tex = new Texture2D(attr.companion!.get("gl"));
      tex.update(val);
      return new TextureReference(tex);
    } else if (val instanceof HTMLVideoElement) {
      return new TextureReference(fromVideoTexture(attr.companion!.get("gl"), val));
    }
  }
  return null;
}
