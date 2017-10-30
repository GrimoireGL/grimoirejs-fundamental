import GLRelatedRegistryBase from "./GLRelatedRegistryBase";
import IGLSLPrecision from "./IGLSLPrecision";
export default class GLSLPrecisionChecker extends GLRelatedRegistryBase {
    public static registryName = "GLSLPrecisionChecker";
    public static get(gl: WebGLRenderingContext) {
        return this.__get(gl, GLSLPrecisionChecker);
    }

    public vertexInteger: IGLSLPrecision;

    public fragmentInteger: IGLSLPrecision;

    public vertexFloat: IGLSLPrecision;

    public fragmentFloat: IGLSLPrecision;

    constructor(public gl: WebGLRenderingContext) {
        super();
        this.vertexInteger = {
            lowp: gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_INT),
            mediump: gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_INT),
            highp: gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_INT),
        };
        this.fragmentInteger = {
            lowp: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_INT),
            mediump: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_INT),
            highp: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_INT),
        };
        this.vertexFloat = {
            lowp: gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.LOW_FLOAT),
            mediump: gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.MEDIUM_FLOAT),
            highp: gl.getShaderPrecisionFormat(gl.VERTEX_SHADER, gl.HIGH_FLOAT),
        };
        this.fragmentFloat = {
            lowp: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.LOW_FLOAT),
            mediump: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.MEDIUM_FLOAT),
            highp: gl.getShaderPrecisionFormat(gl.FRAGMENT_SHADER, gl.HIGH_FLOAT),
        };
    }
}
