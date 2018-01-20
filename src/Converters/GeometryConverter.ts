import { Attribute } from "grimoirejs/ref/Core/Attribute";
import GeometryRegistry from "../Components/GeometryRegistryComponent";
import Geometry from "../Geometry/Geometry";

/**
 * ジオメトリを指定するためのコンバーター
 * `quad`など、ジオメトリ名を指定するか、Geometry型のインスタンスを渡す。
 */
export default function GeometryConverter(val: any, attr: Attribute): any {
  if (typeof val === "string") {
    const Registry = attr.companion.get("GeometryRegistry") as GeometryRegistry;
    return Registry.getGeometry(val);
  } else if (val instanceof Geometry) {
    return Promise.resolve(val);
  }
  throw new Error(`Specified geometry "${val}" is not supported for converting into geometry.`);
}
