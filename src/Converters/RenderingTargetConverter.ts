import { Attribute, LazyAttribute } from "grimoirejs/ref/Core/Attribute";
import RendererComponent from "../Components/RendererComponent";
import IRenderingTarget from "../Resource/RenderingTarget/IRenderingTarget";
import RenderingTargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";
import { Undef } from "grimoirejs/ref/Tool/Types";

function isRenderingTarget(obj: any): obj is IRenderingTarget {
    const typedObj = obj as IRenderingTarget;
    return typeof obj === "object" && !!obj && typeof typedObj.beforeDraw === "function" && typeof typedObj.getBufferHeight === "function" && typeof typedObj.getBufferWidth === "function" && typeof typedObj.getViewport === "function";
}

export const RenderingTargetConverter = {
    name: "RenderingTarget",
    async convert(val: any, attr: Attribute): Promise<Undef<IRenderingTarget>> {
        if (isRenderingTarget(val)) {
            return val;
        } else if (typeof val === "string") {
            if (val === "default") {
                const renderer = attr.component.node.getComponentInAncestor(RendererComponent);
                if (!renderer) {
                    throw new Error(`Can't retrive default rendering target from renderer tag`);
                }
                return await renderer.renderingTarget;
            } else {
                const renderingTarget = RenderingTargetRegistry.get(await attr.companion!.waitFor("gl")).getRenderingTarget(val);
                if (renderingTarget) {
                    return renderingTarget;
                }
                throw new Error(`Specified rendering target "${val}" was not found.`);
            }
        }
    }
}

export default RenderingTargetConverter;