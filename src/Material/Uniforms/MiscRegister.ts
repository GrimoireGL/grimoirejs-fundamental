import MeshIndexCalculator from "../../Util/MeshIndexCalculator";
import Vector2 from "grimoirejs-math/ref/Vector2";
import Material from "../Material";
import Vector4 from "grimoirejs-math/ref/Vector4";
import IMaterialArgument from "../IMaterialArgument";
import UniformProxy from "../../Resource/UniformProxy";
import IVariableInfo from "../Schema/IVariableInfo";
import UniformResolverRegistry from "../UniformResolverRegistry";
import Pass from "../Pass";

UniformResolverRegistry.add("VIEWPORT", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  const vp = args.viewport;
  proxy.uniformVector4(valInfo.name, new Vector4(vp.Left, vp.Top, vp.Width, vp.Height));
});

UniformResolverRegistry.add("VIEWPORT_SIZE", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  const vp = args.viewport;
  proxy.uniformVector2(valInfo.name, new Vector2(vp.Width, vp.Height));
});

UniformResolverRegistry.add("TIME", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  proxy.uniformFloat(valInfo.name, Date.now() % 1.0e7);
});

UniformResolverRegistry.add("HAS_TEXTURE", (valInfo: IVariableInfo, pass: Pass) => {
  const sampler = valInfo.attributes["sampler"];
  if (!sampler) {
    throw new Error(`The variable having HAS_TEXTURE as semantics must have sampler attribute`);
  }
  console.warn(`HAS_TEXTURE is deprecated now. Use flag attribute on sampler2D variables to register macro values`);
  return (proxy: UniformProxy, args: IMaterialArgument) => {
    const hasTexture = !!pass.arguments[sampler] && !!pass.arguments[sampler].get();
    proxy.uniformBool(valInfo.name, hasTexture);
  };
});

UniformResolverRegistry.add("CAMERA_POSITION", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  proxy.uniformVector3(valInfo.name, args.camera.transform.globalPosition);
});

UniformResolverRegistry.add("CAMERA_DIRECTION", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  proxy.uniformVector3(valInfo.name, args.camera.transform.forward);
});

UniformResolverRegistry.add("MESH_INDEX", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  const index = args.renderable.index;
  proxy.uniformVector4(valInfo.name, MeshIndexCalculator.fromIndex(index));
});

export default null;
