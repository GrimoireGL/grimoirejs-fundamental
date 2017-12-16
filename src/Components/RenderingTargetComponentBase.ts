import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import IRenderingTarget from "../Resource/RenderingTarget/IRenderingTarget";
import RenderingTrargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";
export default class RenderingTargetComponentBase<T extends IRenderingTarget> extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        name: {
            converter: "String",
            default: null,
        },
    };

    public renderingTarget: T;

    protected $mount(): void {
        const name = this.getAttribute("name");
        if (!name) {
            throw new Error("Rendering target must have name");
        }
        if (this.node.children.length === 0) {
            this.__instanciateDefaultBuffers(name);
        }
        // TODO: remove this magic
        setImmediate(() => {
            this.renderingTarget = this.__instanciateRenderingTarget(this.companion.get("gl"));
            RenderingTrargetRegistry.get(this.companion.get("gl")).setRenderingTarget(name, this.renderingTarget);
        });
    }
    /*
    */
    protected __instanciateRenderingTarget(gl: WebGLRenderingContext): T {
        return null;
    }

    /**
     * Generate default buffers as children node
     * @param name
     */
    protected __instanciateDefaultBuffers(name: string): void {
        return;
    }
}
