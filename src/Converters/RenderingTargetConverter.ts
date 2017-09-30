import IRenderingTarget from "../Resource/RenderingTarget/IRenderingTarget";
import Attribute from "grimoirejs/ref/Node/Attribute";
import RenderingTargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";
import RendererComponent from "../Components/RendererComponent";

function isRenderingTarget(obj: any): obj is IRenderingTarget {
    let typedObj = obj as IRenderingTarget;
    return typeof obj === "object" && typeof typedObj.beforeDraw === "function" && typeof typedObj.getBufferHeight === "function" && typeof typedObj.getBufferWidth === "function" && typeof typedObj.getViewport === "function";
}

export default function RenderingTargetConverter(val: any, attr: Attribute): IRenderingTarget {
    if (isRenderingTarget(val)) {
        return val;
    }else if(typeof val === "string"){
        if(val === "default"){
            const renderer = attr.component.node.getComponentInAncestor(RendererComponent);
            return renderer.renderingTarget;
        }else{
            return RenderingTargetRegistry.get(attr.companion.get("gl")).getRenderingTarget(val);
        }
    }
    return null;
}