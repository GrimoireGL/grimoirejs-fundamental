import Rectangle from "grimoirejs-math/ref/Rectangle";
import CameraComponent from "../Components/CameraComponent";
import TransformComponent from "../Components/TransformComponent";
import Geometry from "../Geometry/Geometry";
import IRenderable from "../SceneRenderer/IRenderable";
interface IMaterialArgument {
  indexGroup: string;
  geometry: Geometry;
  sceneDescription: { [key: string]: any };
  rendererDescription: { [key: string]: any };
  camera: CameraComponent;
  viewport: Rectangle;
  transform: TransformComponent;
  drawOffset?: number;
  drawCount?: number;
  technique: string;
  renderable?: IRenderable;
}

export default IMaterialArgument;
