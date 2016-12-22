import Vector4 from "grimoirejs-math/ref/Vector4";
import IMaterialArgument from "../IMaterialArgument";
import UniformProxy from "../../Resource/UniformProxy";
import IVariableInfo from "../IVariableInfo";
import UniformResolverRegistry from "../UniformResolverRegistry";

UniformResolverRegistry.add("VIEWPORT", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  const vp = args.viewport;
  proxy.uniformVector4(valInfo.name, new Vector4(vp.Left, vp.Top, vp.Width, vp.Height));
});

UniformResolverRegistry.add("TIME", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  const vp = args.viewport;
  proxy.uniformFloat(valInfo.name, Date.now() % 1.0e7);
});

export default null;