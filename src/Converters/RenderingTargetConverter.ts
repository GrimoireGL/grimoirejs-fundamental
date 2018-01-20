import { Attribute } from "grimoirejs/ref/Core/Attribute";
import RendererComponent from "../Components/RendererComponent";
import IRenderingTarget from "../Resource/RenderingTarget/IRenderingTarget";
import RenderingTargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";
import { Undef } from "grimoirejs/ref/Tool/Types";

function isRenderingTarget(obj: any): obj is IRenderingTarget {
    const typedObj = obj as IRenderingTarget;
    return typeof obj === "object" && !!obj && typeof typedObj.beforeDraw === "function" && typeof typedObj.getBufferHeight === "function" && typeof typedObj.getBufferWidth === "function" && typeof typedObj.getViewport === "function";
}

export default async function RenderingTargetConverter(val: any, attr: Attribute): Promise<Undef<IRenderingTarget>> {
    if (isRenderingTarget(val)) {
        return val;
    } else if (typeof val === "string") {
        if (val === "default") {
            const renderer = attr.component.node.getComponentInAncestor(RendererComponent);
            if (!renderer) {
                throw new Error(`Can't retrive default rendering target from renderer tag`);
            }
            return renderer.renderingTarget;
        } else {
            const renderingTarget = RenderingTargetRegistry.get(attr.companion!.get("gl")!).getRenderingTarget(val);
            if (renderingTarget) {
                return renderingTarget;
            }
            throw new Error(`Specified rendering target "${val}" was not found.`);
        }
    }
}
