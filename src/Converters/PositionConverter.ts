import { Attribute, StandardAttribute, LazyAttribute } from "grimoirejs/ref/Core/Attribute";
import GomlNode from "grimoirejs/ref/Core/GomlNode";
import Vector3 from "grimoirejs-math/ref/Vector3";

/**
 * 座標を取得するためのコンバーター
 * Vector3コンバーターの受け取り売る値もしくは、任意のシーン中のノードへのクエリを受け取る。
 * クエリを受け取った場合は、そのクエリの示す対象の物体の座標が用いられる。
 */
export const PositionConverter = {
  name: "Position",
  lazy: true as true,
  convert(val: any, attr: LazyAttribute, converterContext: any): (() => Vector3) | undefined {
    if (converterContext._lastVal === val) {
      return converterContext._node.getAttribute("position");
    } else {
      converterContext._lastVal = null;
      try { // TODO: remove try cache after fixed grimoirejs-math.
        const vec = StandardAttribute.convert("Vector3", attr, val);
        if (vec) {
          return vec;
        }
      } catch (e) {

      }
      converterContext._node = StandardAttribute.convert("Node", attr, val) as GomlNode;
      if (converterContext._node) {
        converterContext._lastVal = val;
        return converterContext._node.getAttribute("position"); // TODO should not use getAttribute on node
      }
      return undefined;
    }
  },
};

export default PositionConverter;
