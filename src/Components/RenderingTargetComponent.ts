import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import OffscreenRenderingTarget from "../Resource/RenderingTarget/OffscreenRenderingTarget";
import TextureContainer from "./Texture/TextureContainer";
import RenderingTrargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";
/**
 * Register specified buffer to rendering target.
 * If there were no child buffer node, this component will instanciate default buffers.
 */
export default class RenderingTargetComponent extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        name: {
            converter: "String",
            default: null
        },
        colorBufferFormat: {
            converter: "Enum",
            default: WebGLRenderingContext.RGBA,
            table: {
                RGBA: WebGLRenderingContext.RGBA,
                RGB: WebGLRenderingContext.RGB,
                ALPHA: WebGLRenderingContext.ALPHA,
                LUMINANCE: WebGLRenderingContext.LUMINANCE,
                LUMINANCE_ALPHA: WebGLRenderingContext.LUMINANCE_ALPHA,
                SRGB_EXT: WebGLRenderingContext["SRGB_EXT"],
                SRGB_ALPHA_EXT: WebGLRenderingContext["SRGB_ALPHA_EXT"],
                DEPTH_COMPONENT: WebGLRenderingContext["DEPTH_COMPONENT"],
                DEPTH_STENCIL: WebGLRenderingContext["DEPTH_STENCIL"]
            }
        },
        colorBufferType: {
            converter: "Enum",
            default: WebGLRenderingContext.UNSIGNED_BYTE,
            table: {
                UNSIGNED_BYTE: WebGLRenderingContext.UNSIGNED_BYTE,
                UNSIGNED_SHORT_5_6_5: WebGLRenderingContext.UNSIGNED_SHORT_5_6_5,
                UNSIGNED_SHORT_4_4_4_4: WebGLRenderingContext.UNSIGNED_SHORT_4_4_4_4,
                UNSIGNED_SHORT_5_5_5_1: WebGLRenderingContext.UNSIGNED_SHORT_5_5_5_1,
                UNSIGNED_SHORT: WebGLRenderingContext.UNSIGNED_SHORT,
                UNSIGNED_INT: WebGLRenderingContext.UNSIGNED_INT,
                FLOAT: WebGLRenderingContext.FLOAT
            }
        },
        depthBufferType: {
            converter: "Enum",
            default: WebGLRenderingContext.DEPTH_COMPONENT16,
            table:{
                NONE: 0,
                DEPTH_COMPONENT16: WebGLRenderingContext.DEPTH_COMPONENT16
            }
        }
    };

    public renderingTarget:OffscreenRenderingTarget;

    public $mount(): void {
        const name = this.getAttribute("name");
        if (!name) {
            throw new Error("Rendering target must have name");
        }
        if (this.node.children.length === 0) {
            this._instanciateDefaultBuffers(name);
        }
        const textures = this.node.getComponentsInChildren(TextureContainer);
        const texture = textures[0].texture
        this.renderingTarget = new OffscreenRenderingTarget(this.companion.get("gl"),[texture]);
        RenderingTrargetRegistry.get(this.companion.get("gl")).setRenderingTarget(name,this.renderingTarget);
    }

    /**
     * Generate default buffers as children node
     * @param name 
     */
    private _instanciateDefaultBuffers(name:string): void {
        this.node.addChildByName("color-buffer",{
            name:name,
            format:this.getAttribute("colorBufferFormat"),
            type:this.getAttribute("colorBufferType")
        });
        if(this.getAttribute("depthBufferType") !== 0){
            this.node.addChildByName("render-buffer",{
                name:name,
                type:this.getAttribute("depthBufferType")
            }); 
        }
    }
}