import CanvasSizeObject from "../Objects/CanvasSizeObject";
/**
 * キャンバスのサイズ用のコンバーター
 * 数値を指定した場合(`100`など)はその値をそのまま返す。
 * `aspect(1.6)`などと記述する時、キャンバスのアスペクト比を1.6にするようにリサイズする。
 * `fit`と指定した時、親要素にちょうどマッチするサイズを返す。
 * もし、親要素の高さが0である時かつ、親がbodyである際で`fit`が指定されていると、bodyへの高さ属性が指定されていないものと判断して、
 * 自動的にbodyに`height:100%`を割り当てる。
 */
export default function CanvasSizeConverter(val: any): any {
  if (val === "fit") {
    return {
      mode: "fit",
    } as CanvasSizeObject;
  }
  if (typeof val === "string") {
    const matched = /aspect\(([\d+(?.\d*)?]+)\)/.exec(val);
    if (matched) {
      return {
        mode: "aspect",
        aspect: Number.parseFloat(matched[1])
      };
    }
  }
  return {
    mode: "manual",
    size: Number.parseFloat(val)
  } as CanvasSizeObject;
}
