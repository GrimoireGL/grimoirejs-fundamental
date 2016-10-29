import IMaterialArgument from "../../IMaterialArgument";
import IAttributeDeclaration from "grimoirejs/lib/Node/IAttributeDeclaration";
import UniformProxy from "../../../Resource/UniformProxy";
interface IMaterialAttributeDeclaration extends IAttributeDeclaration {
  register: (proxy: UniformProxy, matrArgs: IMaterialArgument) => void;
}
export default IMaterialAttributeDeclaration;
