import TransformComponent from "../Components/TransformComponent";
import Vector3 from "../../node_modules/grimoirejs/lib/Core/Math/Vector3.d";
import Matrix from "grimoirejs/lib/Core/Math/Matrix";
interface ICamera {
  getViewMatrix(): Matrix;
  getInvViewMatrix(): Matrix;
  getProjectionMatrix(): Matrix;
  getInvProjectionMatrix(): Matrix;
  getViewProjectionMatrix(): Matrix;
  getInvViewProjectionMatrix(): Matrix;
  getFar(): number;
  setFar(far: number): void;
  getNear(): number;
  setNear(near: number): void;
  updateTransform(transform: TransformComponent): void;
}

export default ICamera;
