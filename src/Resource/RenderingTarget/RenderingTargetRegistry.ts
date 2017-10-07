import GLRelatedRegistryBase from "../GLRelatedRegistryBase";
import CanvasRenderingTarget from "./CanvasRenderingTarget";
import IRenderingTarget from "./IRenderingTarget";

type RenderingTargetResolver = (renderingTarget: IRenderingTarget) => void;

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
    public static get(gl: WebGLRenderingContext): RenderingTargetRegistry {
        return this.__get(gl, RenderingTargetRegistry);
    }

    private _renderingTargets: { [key: string]: IRenderingTarget } = {};

    private _renderingTargetResolver: { [key: string]: RenderingTargetResolver[] } = {};

    constructor(public gl: WebGLRenderingContext) {
        super();
        // default rendering target
        this.setRenderingTarget("canvas", new CanvasRenderingTarget(gl));
    }

    /**
     * Register a rendering target to be resolved
     * @param name
     * @param renderingTarget
     */
    public setRenderingTarget(name: string, renderingTarget: IRenderingTarget): void {
        if (name === "default") {
            throw new Error("Rendering target can't be named as 'default'.");
        }
        this._renderingTargets[name] = renderingTarget;
        this._resolveRenderingTargets(name, renderingTarget);
    }

    /**
     * Obtain a rendering taregt from name.
     */
    public async getRenderingTarget(name: string): Promise<IRenderingTarget> {
        const renderingTarget = this._renderingTargets[name];
        if (renderingTarget) {
            return renderingTarget;
        } else {
            return this._waitForRenderingTarget(name);
        }
    }

    /**
     * List of names being resolved aleady
     */
    public get targetNames(): string[] {
        return Object.keys(this._renderingTargets);
    }

    private async _waitForRenderingTarget(name: string): Promise<IRenderingTarget> {
        if (this._renderingTargetResolver[name] === undefined) {
            this._renderingTargetResolver[name] = [];
        }
        return new Promise<IRenderingTarget>((resolver, reject) => {
            this._renderingTargetResolver[name].push(resolver);
        });
    }

    private _resolveRenderingTargets(name: string, target: IRenderingTarget): void {
        const resolvers = this._renderingTargetResolver[name];
        if (resolvers) {
            resolvers.forEach(r => r(target));
        }
    }
}
