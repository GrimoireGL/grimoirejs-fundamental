import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderingTarget from "../Resource/RenderingTarget/IRenderingTarget";
import RenderingTrargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";
import { attribute } from "grimoirejs/ref/Core/Decorator";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
export default class RenderingTargetComponentBase<T extends IRenderingTarget> extends Component {
    public static componentName = "RenderingTargetComponentBase";
    /**
     * Name of Rendering target
     */
    @attribute(StringConverter, null)
    public name!: string;

    public renderingTarget!: T;

    protected $mount(): void {
        if (!this.name) {
            throw new Error("Rendering target must have name");
        }
        if (this.node.children.length === 0) {
            this.__instanciateDefaultBuffers(name);
        }
    }

    protected $mounted(): void {
        const gl = this.companion.get("gl");
        this.renderingTarget = this.__instanciateRenderingTarget(gl);
        RenderingTrargetRegistry.get(gl).setRenderingTarget(this.name, this.renderingTarget);
    }
    /*
    */
    protected __instanciateRenderingTarget(gl: WebGLRenderingContext): T {
        throw new Error(`Abstract method was called unintendedly.`);
    }

    /**
     * Generate default buffers as children node
     * @param name
     */
    protected __instanciateDefaultBuffers(name: string): void {
        return;
    }
}
