import IDynamicStateResolver from "./Schema/IDynamicStateResolver";
import Pass from "./Pass";
export default {
    "dynamic-cull": (args: string[], pass: Pass) => {
        const attributeName = args[1] || "cull";
        pass.addArgument(attributeName, {
            converter: "String",
            default: args[0] || "back"
        });
        return (gl: WebGLRenderingContext) => {
            if (pass.arguments[attributeName] !== "none") {
                gl.enable(WebGLRenderingContext.CULL_FACE);
                if (pass.arguments[attributeName] === "back") {
                    gl.cullFace(WebGLRenderingContext.BACK);
                } else if (pass.arguments[attributeName] === "front") {
                    gl.cullFace(WebGLRenderingContext.FRONT);
                } else {
                    throw new Error("Unknown culling mode");
                }
            } else {
                gl.disable(WebGLRenderingContext.CULL_FACE);
            }
        };
    }
} as { [key: string]: IDynamicStateResolver };
