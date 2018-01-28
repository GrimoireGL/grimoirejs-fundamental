import { Attribute } from "grimoirejs/ref/Core/Attribute";
import GeometryRegistry from "../Components/GeometryRegistryComponent";
import Geometry from "../Geometry/Geometry";

/**
 * ジオメトリを指定するためのコンバーター
 * `quad`など、ジオメトリ名を指定するか、Geometry型のインスタンスを渡す。
 */
export const GeometryConverter = {
  name: "Geometry",
  async convert(val: any, attr: Attribute): Promise<Geometry> {
    if (typeof val === "string") {
      const Registry = await attr.companion!.waitFor("GeometryRegistry") as GeometryRegistry;
      return Registry.getGeometry(val);
    } else if (val instanceof Geometry) {
      return val;
    }
    throw new Error(`Specified geometry "${val}" is not supported for converting into geometry.`);
  },
}

export default GeometryConverter;
