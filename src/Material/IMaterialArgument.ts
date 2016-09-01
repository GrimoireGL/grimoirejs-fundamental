import Geometry from "../Geometry/Geometry";
interface IMaterialArgument {
  geometry: Geometry;
  attributeValues: { [key: string]: any };
}

export default IMaterialArgument;
