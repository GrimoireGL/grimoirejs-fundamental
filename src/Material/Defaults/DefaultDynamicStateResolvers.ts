import Pass from "../Pass";
import IDynamicStateResolver from "../Schema/IDynamicStateResolver";
export default {
    "dynamic-cull": (args: string[], pass: Pass) => {
        const attributeName = args[1] || "cull";
        pass.addArgument(attributeName, {
            converter: "String",
            default: args[0] || "back",
        });
        const currentState = null;
        function changeState(state: string) {
            if (currentState !== state) {
                pass.program.setMacro("CONTEXT_STATE_CULL", state);
            }
        }
        return (gl: WebGLRenderingContext) => {
            if (pass.arguments[attributeName] !== "none") {
                gl.enable(WebGLRenderingContext.CULL_FACE);
                if (pass.arguments[attributeName] === "back") {
                    gl.cullFace(WebGLRenderingContext.BACK);
                    changeState("1");
                } else if (pass.arguments[attributeName] === "front") {
                    gl.cullFace(WebGLRenderingContext.FRONT);
                    changeState("2");
                } else {
                    throw new Error("Unknown culling mode");
                }
            } else {
                gl.disable(WebGLRenderingContext.CULL_FACE);
                changeState("0");
            }
        };
    },
} as { [key: string]: IDynamicStateResolver };
