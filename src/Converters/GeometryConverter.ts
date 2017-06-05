import Attribute from "grimoirejs/ref/Node/Attribute";
import Geometry from "../Geometry/Geometry";
import GeometryRegistory from "../Components/GeometryRegistoryComponent";

/**
 * ジオメトリを指定するためのコンバーター
 * `quad`など、ジオメトリ名を指定するか、Geometry型のインスタンスを渡す。
 */
export default function GeometryConverter(val: any, attr: Attribute): any {
  if (typeof val === "string") {
    const registory = attr.companion!.get("GeometryRegistory") as GeometryRegistory;
    return registory.getGeometry(val);
  } else if (val instanceof Geometry) {
    return Promise.resolve(val);
  }
  throw new Error(`Specified geometry "${val}" is not supported for converting into geometry.`);
}
