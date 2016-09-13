import IMaterialArgument from "./IMaterialArgument";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration.d";
import UniformProxy from "../Resource/UniformProxy";
interface IMaterialAttributeDeclaration extends IAttributeDeclaration {
  register: (proxy: UniformProxy, val: any, matrArgs: IMaterialArgument) => void;
}
export default IMaterialAttributeDeclaration;
