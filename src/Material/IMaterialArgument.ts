import IRenderable from "../SceneRenderer/IRenderable";
import CameraComponent from "../Components/CameraComponent";
import Rectangle from "grimoirejs-math/ref/Rectangle";
import Texture2D from "../Resource/Texture2D";
import TransformComponent from "../Components/TransformComponent";
import Geometry from "../Geometry/Geometry";
interface IMaterialArgument {
  targetBuffer: string;
  geometry: Geometry;
  attributeValues: { [key: string]: any };
  sceneDescription: { [key: string]: any };
  camera: CameraComponent;
  viewport: Rectangle;
  transform: TransformComponent;
  buffers: { [key: string]: Texture2D; };
  drawOffset: number;
  drawCount: number;
  technique: string;
  renderable: IRenderable;
}

export default IMaterialArgument;
