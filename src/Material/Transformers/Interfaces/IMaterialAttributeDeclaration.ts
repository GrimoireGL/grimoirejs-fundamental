import gr from "grimoirejs";
import IMaterialArgument from "../../IMaterialArgument";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import UniformProxy from "../../../Resource/UniformProxy";
interface IMaterialAttributeDeclaration extends IAttributeDeclaration {
  register: (proxy: UniformProxy, matrArgs: IMaterialArgument) => void;
}
export default IMaterialAttributeDeclaration;
