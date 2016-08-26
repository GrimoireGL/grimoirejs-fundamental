import Geometry from "../Geometry/Geometry";
function GeometryConverter(val: any): any {
  if (typeof val === "string") {
    return this.companion.get("GeometryRegistory").getGeometry(val);
  } else if (val instanceof Geometry) {
    return val;
  }
}

export default GeometryConverter;
