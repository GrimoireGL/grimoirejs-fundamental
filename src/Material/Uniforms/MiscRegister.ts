import Material from "../Material";
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

UniformResolverRegistry.add("HAS_TEXTURE", (valInfo: IVariableInfo, material: Material) => {
  const sampler = valInfo.attributes["sampler"];
  if (!sampler) {
    throw new Error(`The variable have HAS_TEXTURE as semantics must have sampler attribute`);
  }
  return (proxy: UniformProxy, args: IMaterialArgument) => {
    const hasTexture = !!material.arguments[valInfo.name] && !!material.arguments[valInfo.name].get(args.buffers);
    proxy.uniformBool(valInfo.name, hasTexture);
  };
});

export default null;