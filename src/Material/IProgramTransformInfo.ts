import IMaterialArgument from "./IMaterialArgument";
import UniformProxy from "../Resource/UniformProxy";
import IMaterialAttributeDeclaration from "./IMaterialAttributeDeclaration";
import IVariableInfo from "./IVariableInfo";

interface IProgramTransformInfo {
  fragment: string;
  vertex: string;
  uniforms: { [variableName: string]: IVariableInfo };
  attributes: { [variableName: string]: IVariableInfo };
  fragmentPrecision: { [key: string]: string };
  vertexPrecision: { [key: string]: string };
  configurator: ((gl: WebGLRenderingContext) => void)[];
  systemRegisterers: ((proxy: UniformProxy, args: IMaterialArgument) => void)[];
  gomlAttributes: { [key: string]: IMaterialAttributeDeclaration; };
}

export default IProgramTransformInfo;
