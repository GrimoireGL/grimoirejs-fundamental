import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import OffscreenRenderingTarget from "../Resource/RenderingTarget/OffscreenRenderingTarget";
import RenderingTrargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";
import RenderingTargetComponentBase from "./RenderingTargetComponentBase";
import RenderBufferUpdator from "./Texture/RenderBufferUpdator";
import TextureContainer from "./Texture/TextureContainer";
import { attribute } from "grimoirejs/ref/Core/Decorator";
import { EnumConverter } from "grimoirejs/ref/Converter/EnumConverter";
import GLConstantUtility from "../Util/GLConstantUtility";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
/**
 * Register specified buffer to rendering target.
 * If there were no child buffer node, this component will instanciate default buffers.
 */
export default class RenderingTarget extends RenderingTargetComponentBase<OffscreenRenderingTarget> {
    public static componentName = "RenderingTarget";
    /**
     * Color buffer format
     */
    @attribute(EnumConverter, WebGLRenderingContext.RGBA, "colorBufferFormat", { table: GLConstantUtility.textureFormatFromName })
    public colorBufferFormat!: number;

    /**
     * Element type of Color buffer
     */
    @attribute(EnumConverter, WebGLRenderingContext.UNSIGNED_BYTE, "colorBufferType", { table: GLConstantUtility.textureElementTypeFromName })
    public colorBufferType!: number;

    /**
     * Element type of depth buffer.
     */
    @attribute(EnumConverter, WebGLRenderingContext.DEPTH_COMPONENT16, "depthBufferType", {
        table: {
            DEPTH_COMPONENT16: WebGLRenderingContext.DEPTH_COMPONENT16,
        }
    })
    public depthBufferType!: number;

    /**
     * Use depth buffer or not
     */
    @attribute(BooleanConverter, true)
    public useDepthBuffer!: boolean;

    /**
     * Viewport size of children
     */
    @attribute(StringConverter, "ViewportSize")
    public resizerType!: string;

    protected __instanciateRenderingTarget(gl: WebGLRenderingContext): OffscreenRenderingTarget {
        const textures = this.node.getComponentsInChildren(TextureContainer);
        const texture = textures[0].texture;
        const renderBuffer = this.node.getComponentsInChildren(RenderBufferUpdator);
        return new OffscreenRenderingTarget(this.companion.get("gl")!, [texture], renderBuffer[0].buffer);
    }

    /**
     * Generate default buffers as children node
     * @param name
     */
    protected __instanciateDefaultBuffers(name: string): void {
        this.node.addChildByName("color-buffer", {
            name,
            format: this.getAttribute("colorBufferFormat"),
            type: this.getAttribute("colorBufferType"),
            resizerType: this.getAttribute("resizerType"),
        });
        if (this.getAttribute("depthBufferType") !== 0) {
            this.node.addChildByName("render-buffer", {
                name,
                type: this.getAttribute("depthBufferType"),
                resizerType: this.getAttribute("resizerType"),
            });
        }
    }
}
