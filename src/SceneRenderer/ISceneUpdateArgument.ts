import Timer from "../Util/Timer";
/**
 * Argument schema of $update
 */
interface ISceneUpdateArgument {
  sceneDescription: {[key: string]: any};
  timer: Timer;
}

export default ISceneUpdateArgument;
