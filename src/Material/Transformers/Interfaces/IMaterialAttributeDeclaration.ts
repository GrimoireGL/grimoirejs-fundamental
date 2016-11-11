import gr from "grimoirejs";
import IMaterialArgument from "../../IMaterialArgument";
const IAttributeDeclaration = gr.Node.IAttributeDeclaration;
import UniformProxy from "../../../Resource/UniformProxy";
interface IMaterialAttributeDeclaration extends IAttributeDeclaration {
  register: (proxy: UniformProxy, matrArgs: IMaterialArgument) => void;
}
export default IMaterialAttributeDeclaration;
