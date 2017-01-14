import gr from "grimoirejs";
import Attribute from "grimoirejs/ref/Node/Attribute";
import Geometry from "../Geometry/Geometry";

export default function GeometryConverter(this: Attribute, val: any): any {
  if (typeof val === "string") {
    return this.companion.get("GeometryRegistory").getGeometry(val);
  } else if (val instanceof Geometry) {
    return val;
  }
  throw new Error(`Specified geometry "${val}" is not supported for converting into geometry.`)
}
