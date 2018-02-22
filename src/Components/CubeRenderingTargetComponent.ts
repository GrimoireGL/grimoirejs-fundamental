import Component from "grimoirejs/ref/Core/Component";
import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import OffscreenCubemapRenderTarget from "../Resource/RenderingTarget/OffscreenCubemapRenderingTarget";
import OffscreenRenderingTarget from "../Resource/RenderingTarget/OffscreenRenderingTarget";
import RenderingTrargetRegistry from "../Resource/RenderingTarget/RenderingTargetRegistry";
import RenderingTargetComponentBase from "./RenderingTargetComponentBase";
import RenderBufferUpdator from "./Texture/RenderBufferUpdator";
import TextureContainer from "./Texture/TextureContainer";
import TextureCubeContainer from "./Texture/TextureCubeContainer";
import { EnumConverter } from "grimoirejs/ref/Converter/EnumConverter";
import { attribute } from "grimoirejs/ref/Core/Decorator";
import GLConstantUtility from "../Util/GLConstantUtility";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";

/**
 * Register specified buffer to rendering target.
 * If there were no child buffer node, this component will instanciate default buffers.
 */
export default class CubeRenderingTargetComponent extends RenderingTargetComponentBase<OffscreenCubemapRenderTarget> {
    public static componentName = "CubemapRenderingTarget";

    /**
    * Format of color buffer. 
    * RGBA,RGB,ALPHA,LUMINANCE,LUMINANCE_ALPHA,SRGB_EXT,SRGB_ALPHA_EXT,DEPTH_COMPONENT,DEPTH_STENCIL
    */
    @attribute(EnumConverter, WebGLRenderingContext.RGBA, "colorBufferFormat", GLConstantUtility.textureFormatFromName)
    public colorBufferFormat!: number;

    /**
    * Type of color buffer elements.
    * UNSIGNED_BYTE,UNSIGNED_SHORT_5_6_5,UNSIGNED_SHORT_4_4_4_4,UNSIGNED_SHORT_5_5_5_1,UNSIGNED_SHORT,UNSIGNED_INT,FLOAT
    */
    @attribute(EnumConverter, WebGLRenderingContext.UNSIGNED_BYTE)
    public colorBufferType!: number;

    /**
     * Type of depth buffer element. If you specify 0 or "NONE" as a value, rendering target will not use depth buffer.
    * NONE,DEPTH_COMPONENT16,
    */
    @attribute(EnumConverter, WebGLRenderingContext.DEPTH_COMPONENT16)
    public depthBufferType!: number;

    /**
    * Resizer type of children.
    */
    @attribute(StringConverter, "ViewportSize")
    public resizerType!: string;


    protected __instanciateRenderingTarget(gl: WebGLRenderingContext): OffscreenCubemapRenderTarget {
        const textures = this.node.getComponentsInChildren(TextureCubeContainer);
        const texture = textures[0].texture;
        const renderBuffer = this.node.getComponentsInChildren(RenderBufferUpdator);
        return new OffscreenCubemapRenderTarget(this.companion.get("gl")!, texture, renderBuffer[0].buffer);
    }

    /**
     * Generate default buffers as children node
     * @param name
     */
    protected __instanciateDefaultBuffers(name: string): void {
        this.node.addChildByName("color-buffer-cube", {
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
