import IVariableInfo from "../IVariableInfo";
import IMaterialArgument from "../IMaterialArgument";
import UniformProxy from "../../Resource/UniformProxy";
import UniformResolverRegistry from "../UniformResolverRegistry";

UniformResolverRegistry.add("MODELVIEWPROJECTION", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  proxy.uniformMatrix(valInfo.name, args.transform.calcPVM(args.camera));
});

export default null;