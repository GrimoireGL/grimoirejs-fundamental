import IAttributeDeclaration from "grimoirejs/lib/Core/Node/IAttributeDeclaration.d";
import UniformProxy from "../Resource/UniformProxy";
interface IMaterialAttributeDeclaration extends IAttributeDeclaration {
  register: (proxy: UniformProxy, val: any) => void;
}
export default IMaterialAttributeDeclaration;
