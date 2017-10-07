import GLRelatedRegistryBase from "../GLRelatedRegistryBase";
import CanvasRenderingTarget from "./CanvasRenderingTarget";
import IRenderingTarget from "./IRenderingTarget";

/**
 * RenderingTargetRegistry is container class of rendering target.
 * Rendering target consists of 2 types.
 * Offscreen rendering target is used for rendering into non screen buffer(Texture)
 * Default rendering target is used for rendering into screen.
 */
export default class RenderingTargetRegistry extends GLRelatedRegistryBase {

    public static registryName = "RenderingTargetRegistry";
    /**
     * Obtain reference of the class by WebGLRenderingContext.
     * @param gl
     */
    public static get (gl: WebGLRenderingContext): RenderingTargetRegistry {
        return this.__get(gl, RenderingTargetRegistry);
    }

    public renderingTargets: { [key: string]: IRenderingTarget } = {};

    constructor (public gl: WebGLRenderingContext) {
        super();
        // default rendering target
        this.setRenderingTarget("canvas", new CanvasRenderingTarget(gl));
    }

    public setRenderingTarget (name: string, renderingTarget: IRenderingTarget): void {
        if (name === "default"){
            throw new Error("Rendering target can't be named as 'default'.");
        }
        this.renderingTargets[name] = renderingTarget;
    }

    public getRenderingTarget (name: string): IRenderingTarget{
        return this.renderingTargets[name];
    }
}
