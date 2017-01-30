import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Geometry from "../Geometry/Geometry";

/**
 * ジオメトリを指定するためのコンバーター
 * `quad`など、ジオメトリ名を指定するか、Geometry型のインスタンスを渡す。
 */
export default function GeometryConverter(val: any, attr: Attribute): any {
  if (typeof val === "string") {
    return attr.companion.get("GeometryRegistory").getGeometry(val);
  } else if (val instanceof Geometry) {
    return val;
  }
  throw new Error(`Specified geometry "${val}" is not supported for converting into geometry.`);
}
