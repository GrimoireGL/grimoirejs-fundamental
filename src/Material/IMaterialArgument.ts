import Texture2D from "../Resource/Texture2D";
import TransformComponent from "../Components/TransformComponent";
import ICamera from "../Camera/ICamera";
import Geometry from "../Geometry/Geometry";
interface IMaterialArgument {
  targetBuffer: string;
  geometry: Geometry;
  attributeValues: { [key: string]: any };
  camera: ICamera;
  transform: TransformComponent;
  buffers: { [key: string]: Texture2D; };
}

export default IMaterialArgument;
