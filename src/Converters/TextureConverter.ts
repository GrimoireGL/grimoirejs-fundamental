import Attribute from "grimoirejs/ref/Core/Attribute";
import { Nullable } from "grimoirejs/ref/Tools/Types";
import ImageResolver from "../Asset/ImageResolver";
import TextureContainer from "../Components/Texture/TextureContainer";
import TextureReference from "../Material/TextureReference";
import RenderingBufferResourceRegistry from "../Resource/RenderingTarget/RenderingBufferResourceRegistry";
import Texture2D from "../Resource/Texture2D";

type Query = {
  type: "query" | "backbuffer",
  param: string,
};

function _parseQuery(query: string): Nullable<Query> {
  const regex = /(query|backbuffer)\((.+)\)[^\)]*$/;
  let regexResult;
  if ((regexResult = regex.exec(query))) {
    return {
      type: regexResult[1] as "query" | "backbuffer",
      param: regexResult[2],
    };
  }
  return null;
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
          return new TextureReference((buffers) => RenderingBufferResourceRegistry.get(attr.companion.get("gl")).getBackbuffer(param));
        case "query":
          const obtainedTag = attr.tree(param);
          const texture = obtainedTag.first().getComponent(TextureContainer);
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
    }
  }
  return null;
}
