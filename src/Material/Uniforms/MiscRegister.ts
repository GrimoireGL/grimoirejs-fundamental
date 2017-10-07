import Vector2 from "grimoirejs-math/ref/Vector2";
import Vector4 from "grimoirejs-math/ref/Vector4";
import ViewportBaseMouseState from "../../Objects/ViewportBaseMouseState";
import UniformProxy from "../../Resource/UniformProxy";
import MeshIndexCalculator from "../../Util/MeshIndexCalculator";
import IMaterialArgument from "../IMaterialArgument";
import Pass from "../Pass";
import IVariableInfo from "../Schema/IVariableInfo";
import UniformResolverRegistry from "../UniformResolverRegistry";

UniformResolverRegistry.add("VIEWPORT", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  const vp = args.viewport;
  proxy.uniformVector4(valInfo.name, new Vector4(vp.Left, vp.Top, vp.Width, vp.Height));
});

UniformResolverRegistry.add("VIEWPORT_SIZE", (valInfo: IVariableInfo) => (proxy: UniformProxy, args: IMaterialArgument) => {
  const vp = args.viewport;
  proxy.uniformVector2(valInfo.name, new Vector2(vp.Width, vp.Height));
});

UniformResolverRegistry.add("TIME", (valInfo: IVariableInfo) => {
  const unit = valInfo.attributes["unit"] || "ms";
  let divider = 1;
  switch (unit) {
    case "s":
      divider = 1000;
      break;
  }
  return (proxy: UniformProxy, args: IMaterialArgument) => {
    proxy.uniformFloat(valInfo.name, (Date.now() / divider) % 100000);
  };
});

UniformResolverRegistry.add("HAS_TEXTURE", (valInfo: IVariableInfo, pass: Pass) => {
  const sampler = valInfo.attributes["sampler"];
  if (!sampler) {
    throw new Error("The variable having HAS_TEXTURE as semantics must have sampler attribute");
  }
  console.warn("HAS_TEXTURE is deprecated now. Use flag attribute on sampler2D variables to register macro values");
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

UniformResolverRegistry.add("MOUSE_POSITION", (valInfo: IVariableInfo) => {
  const coords = valInfo.attributes["coord"] || "viewportNormalized";
  return (proxy: UniformProxy, args: IMaterialArgument) => {
    const mouseDesc = args.rendererDescription["mouse"] as ViewportBaseMouseState;
    if (mouseDesc) {
      proxy.uniformVector2(valInfo.name, new Vector2(mouseDesc.coords[coords][0], mouseDesc.coords[coords][1]));
    } else {
      proxy.uniformVector2(valInfo.name, Vector2.Zero);
    }
  };
});

UniformResolverRegistry.add("MOUSE_STATE", (valInfo: IVariableInfo) => {
  return (proxy: UniformProxy, args: IMaterialArgument) => {
    const mouseDesc = args.rendererDescription["mouse"] as ViewportBaseMouseState;
    if (mouseDesc) {
      proxy.uniformVector2(valInfo.name, new Vector2(mouseDesc.left ? 1 : 0, mouseDesc.right ? 1 : 0));
    } else {
      proxy.uniformVector2(valInfo.name, Vector2.Zero);
    }
  };
});

export default null;
