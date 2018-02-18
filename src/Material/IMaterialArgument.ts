import Rectangle from "grimoirejs-math/ref/Rectangle";
import CameraComponent from "../Components/CameraComponent";
import Transform from "../Components/TransformComponent";
import Geometry from "../Geometry/Geometry";
import HierachicalDescription from "../SceneRenderer/HierachicalDescription";
import IRenderable from "../SceneRenderer/IRenderable";
import { Undef } from "grimoirejs/ref/Tool/Types";
interface IMaterialArgument {
  indexGroup: string;
  geometry: Geometry;
  sceneDescription: { [key: string]: any };
  rendererDescription: { [key: string]: any };
  camera: Undef<CameraComponent>;
  viewport: Rectangle;
  transform: Undef<Transform>;
  drawOffset?: number;
  drawCount?: number;
  technique: string;
  renderable?: IRenderable;
  hierarchicalDescription?: HierachicalDescription;
}

export default IMaterialArgument;
