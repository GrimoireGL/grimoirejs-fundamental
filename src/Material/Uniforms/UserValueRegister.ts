import Material from "../Material";
import IVariableInfo from "../IVariableInfo";
import IMaterialArgument from "../IMaterialArgument";
import UniformProxy from "../../Resource/UniformProxy";
import UniformResolverRegistry from "../UniformResolverRegistry";

UniformResolverRegistry.add("USER_VALUE", (valInfo: IVariableInfo, material: Material) => {
  switch (valInfo.type) {
    case WebGLRenderingContext.FLOAT:
      if (valInfo.count) {

      } else {
        material.addArgument(valInfo.name, {
          default: 0,
          converter: "Number"
        });
        return {
          register: (proxy) => {
            proxy.uniformFloat(valInfo.name, material.arguments[valInfo.name]);
          },
          dispose: () => {
            material.deleteArgument(valInfo.name);
          }
        };
      }
  }
});

export default null;