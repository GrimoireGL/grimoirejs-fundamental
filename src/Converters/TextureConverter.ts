import { Nullable } from "grimoirejs/ref/Tool/Types";
import { Attribute } from "grimoirejs/ref/Core/Attribute";
import ImageResolver from "../Asset/ImageResolver";
import TextureContainer from "../Components/Texture/TextureContainer";
import TextureReference from "../Material/TextureReference";
import RenderingBufferResourceRegistry from "../Resource/RenderingTarget/RenderingBufferResourceRegistry";
import Texture2D from "../Resource/Texture2D";
import QueryParser from "../Util/QueryParser";

/**
 * テクスチャへの参照を取得するためのコンバーター
 * 渡すものが文字列である場合、4つの方法がある。
 * * `url`・・・指定したアドレスから画像を解決して取得する
 * * `backbuffer(バックバッファ名)`・・・名前付きバックバッファのリストから取得する
 * * `query(<texture>へのクエリ)`・・・指定したクエリで`<texture>`を探索して利用する。
 * 渡すものがオブジェクトである場合、5つの方法がある。
 * * `Texture2D型`・・・そのまま利用される
 * * `HTMLImageElement`・・・必要がある場合リサイズされた上で利用される。(自動的に2の累乗に変換される)
 * * `HTMLCanvasElement`・・・必要がある場合リサイズされた上で利用される。(自動的に2の累乗に変換される)
 */
// TODO: remove Texture reference
export const TextureConverter = {
  name: "Texture",
  convert(val: any, attr: Attribute): Nullable<TextureReference> {
    if (val instanceof Texture2D) {
      return new TextureReference(val);
    } else if (val instanceof TextureReference) {
      return val;
    } else if (typeof val === "string") {
      const parseResult = QueryParser.parseFunctionalQuery(val, "url");
      switch (parseResult[0]) {
        case "backbuffer":
          return new TextureReference(() => RenderingBufferResourceRegistry.get(attr.companion!.get("gl")!).getBackbuffer(parseResult[1]) as Texture2D);
        case "query":
          const obtainedTag = attr.tree!(parseResult[1]);
          if (!obtainedTag) {
            throw new Error(`Specified query '${parseResult[1]}' returned empty quering result.`);
          }
          const texture = obtainedTag.first()!.getComponent(TextureContainer);
          if (!texture) {
            throw new Error(`Specified tag '${parseResult[1]}' should have TextureContainer component`);
          }
          return new TextureReference(() => texture.texture);
        case "url":
          const tex = new Texture2D(attr.companion!.get("gl")!);
          ImageResolver.resolve(val).then(t => {
            tex.update(t);
          });
          attr.companion!.get("loader").register(tex.validPromise);
          return new TextureReference(tex);
        case "video":
          throw new Error("video(url) is deprecated syntax. Use video-texture tag and refer it with query()");
      }

    }
    if (typeof val === "object") {
      if (val instanceof HTMLImageElement) {
        const tex = new Texture2D(attr.companion!.get("gl")!);
        ImageResolver.waitForImageLoaded(val).then(() => {
          tex.update(val);
        });
        return new TextureReference(tex);
      } else if (val instanceof HTMLCanvasElement) {
        const tex = new Texture2D(attr.companion!.get("gl")!);
        tex.update(val);
        return new TextureReference(tex);
      }
    }
    return null;
  }
}

export default TextureConverter;