import TransformComponent from "../Components/TransformComponent";
import Matrix from "grimoirejs-math/ref/Matrix";

/**
 * Provides basic abstraction for camera.
 */
interface ICamera {
  /**
   * Provides calculation result of view-matrix
   * @return {Matrix} [The view-matrix]
   */
  getViewMatrix(): Matrix;

  /**
   * Provides calculation result of projection-matrix.
   * @return {Matrix} [The projection-matrix]
   */
  getProjectionMatrix(): Matrix;
  /**
   * Provides calculation result of inverted projection-matrix.
   * @return {Matrix} [The projection-matrix]
   */
  getInvProjectionMatrix(): Matrix;
  /**
   * Provides calculation result of multipling of projection-matrix and view-matrix.
   * @return {Matrix} [projection-matrix * view-matrix]
   */
  getProjectionViewMatrix(): Matrix;

  /**
   * Getter for depth of far clip.
   * @return {number} [far clip]
   */
  getFar(): number;
  /**
   * Setter for depth of far clip
   * @param {number} far [far clip]
   */
  setFar(far: number): void;
  /**
   * Getter for depth of near clip
   * @return {number} [near clip]
   */
  getNear(): number;
  /**
   * Setter for depth of near clip.
   * @param {number} near [near clip]
   */
  setNear(near: number): void;

  /**
   * Getter for aspect ratio
   * @return {number} [description]
   */
  getAspect(): number;

  /**
   * Setter for aspect ratio
   * @return {number} [description]
   */
  setAspect(aspect: number);

  /**
   * Getter for fovy
   * @return {number} [description]
   */
  getFovy(): number;

  /**
   * Setter for fovy
   * @return {number} [description]
   */
  setFovy(fovy: number): void;

  getOrthoSize(): number;

  setOrthoSize(size: number): void;
  /**
   * Notify transform of this camera was updated to recalculate view-matrix.
   * @param {TransformComponent} transform [transform of camera]
   */
  updateTransform(transform: TransformComponent): void;
}

export default ICamera;
