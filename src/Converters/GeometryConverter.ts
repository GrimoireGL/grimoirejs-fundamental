import { Attribute } from "grimoirejs/ref/Core/Attribute";
import GeometryRegistry from "../Components/GeometryRegistryComponent";
import Geometry from "../Geometry/Geometry";
import { Nullable } from "grimoirejs/ref/Tool/Types";
class AwaitableGeometry {
  public geometry: Nullable<Geometry> = null;
  constructor(public promise: Promise<Geometry>) {
    promise.then((g) => this.geometry = g);
  }

  public getGeometry(): Nullable<Geometry> {
    return this.geometry;
  }
}
/**
 * ジオメトリを指定するためのコンバーター
 * `quad`など、ジオメトリ名を指定するか、Geometry型のインスタンスを渡す。
 */
export const GeometryConverter = {
  name: "Geometry",
  lazy: true as true,
  convert(val: any, attr: Attribute): () => Nullable<Geometry> {
    if (typeof val === "string") {
      let geometryRef: Nullable<() => Nullable<Geometry>> = null;
      attr.companion!.waitFor("GeometryRegistry").then((gr: GeometryRegistry) => {
        geometryRef = gr.resolver.getReferenceFunction(val);
      })
      return () => {
        return geometryRef ? geometryRef() : null;
      };
    } else if (val instanceof Geometry) {
      return () => val;
    }
    throw new Error(`Specified geometry "${val}" is not supported for converting into geometry.`);
  },
}

export default GeometryConverter;
