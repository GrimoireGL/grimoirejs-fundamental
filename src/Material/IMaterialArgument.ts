import TransformComponent from "../Components/TransformComponent";
import ICamera from "../Camera/ICamera";
import Geometry from "../Geometry/Geometry";
interface IMaterialArgument {
  targetBuffer: string;
  geometry: Geometry;
  attributeValues: { [key: string]: any };
  camera: ICamera;
  transform: TransformComponent;
}

export default IMaterialArgument;
