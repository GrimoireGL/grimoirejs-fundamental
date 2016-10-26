import IMaterialArgument from "./IMaterialArgument";
import UniformProxy from "../Resource/UniformProxy";
import IMaterialAttributeDeclaration from "./IMaterialAttributeDeclaration";
import IVariableInfo from "./IVariableInfo";

interface ISORTPassInfo {
  shaderSource: string;
  uniforms: { [variableName: string]: IVariableInfo };
  attributes: { [variableName: string]: IVariableInfo };
  configurator: ((gl: WebGLRenderingContext) => void)[];
  systemRegisterers: ((proxy: UniformProxy, args: IMaterialArgument) => void)[];
  gomlAttributes: { [key: string]: IMaterialAttributeDeclaration; };
}

export default ISORTPassInfo;
