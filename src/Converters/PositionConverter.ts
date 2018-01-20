import { Attribute, StandardAttribute, LazyAttribute } from "grimoirejs/ref/Core/Attribute";
import GomlNode from "grimoirejs/ref/Core/GomlNode";

/**
 * 座標を取得するためのコンバーター
 * Vector3コンバーターの受け取り売る値もしくは、任意のシーン中のノードへのクエリを受け取る。
 * クエリを受け取った場合は、そのクエリの示す対象の物体の座標が用いられる。
 */
export default {
  name: "Position",
  lazy: true,
  verify(attr: Attribute) {
    return true;
  },
  convert(val: any, attr: Attribute, converterContext: any) {
    if (converterContext._lastVal === val) {
      return converterContext._node.getAttribute("position");
    } else {
      converterContext._lastVal = null;
      try { // TODO: remove try cache after fixed grimoirejs-math.
        const vec = StandardAttribute.convert("Vector3", attr as LazyAttribute, val);
        if (vec) {
          return vec;
        }
      } catch (e) {

      }
      converterContext._node = StandardAttribute.convert("Node", attr as LazyAttribute, val) as GomlNode;
      if (converterContext._node) {
        converterContext._lastVal = val;
        return converterContext._node.getAttribute("position"); // TODO should not use getAttribute on node
      }
    }
  },
};
