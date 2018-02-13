import Pass from "../Pass";
import IDynamicStateResolver from "../Schema/IDynamicStateResolver";
import GLStateConfigurator from "../GLStateConfigurator";
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
            const gc = GLStateConfigurator.get(gl);
            if (pass.arguments[attributeName] !== "none") {
                gc.applyGLFlagIfChanged(WebGLRenderingContext.CULL_FACE, true);
                if (pass.arguments[attributeName] === "back") {
                    gc.applyIfChanged("cullFace", WebGLRenderingContext.BACK);
                    changeState("1");
                } else if (pass.arguments[attributeName] === "front") {
                    gc.applyIfChanged("cullFace", WebGLRenderingContext.FRONT);
                    changeState("2");
                } else {
                    throw new Error("Unknown culling mode");
                }
            } else {
                gc.applyGLFlagIfChanged(WebGLRenderingContext.CULL_FACE, false);
                changeState("0");
            }
        };
    },
} as { [key: string]: IDynamicStateResolver };
