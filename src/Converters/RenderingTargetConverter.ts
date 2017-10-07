import Attribute from "grimoirejs/ref/Node/Attribute";
import RendererComponent from "../Components/RendererComponent";
import IRenderingTarget from "../Resource/RenderingTarget/IRenderingTarget";
import RenderingTargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";

function isRenderingTarget(obj: any): obj is IRenderingTarget {
    const typedObj = obj as IRenderingTarget;
    return typeof obj === "object" && typeof typedObj.beforeDraw === "function" && typeof typedObj.getBufferHeight === "function" && typeof typedObj.getBufferWidth === "function" && typeof typedObj.getViewport === "function";
}

export default async function RenderingTargetConverter(val: any, attr: Attribute): Promise<IRenderingTarget> {
    if (isRenderingTarget(val)) {
        return val;
    } else if (typeof val === "string") {
        if (val === "default") {
            const renderer = attr.component.node.getComponentInAncestor(RendererComponent);
            return renderer.renderingTarget;
        } else {
            const renderingTarget = RenderingTargetRegistry.get(attr.companion.get("gl")).getRenderingTarget(val);
            if (renderingTarget) {
                return renderingTarget;
            }
            throw new Error(`Specified rendering target "${val}" was not found.`);
        }
    }
    return null;
}
