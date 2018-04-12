import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";
import Texture from "../../Resource/Texture";
import StringConverter from "grimoirejs/ref/Converter/StringConverter";
import EnumConverter from "grimoirejs/ref/Converter/EnumConverter";
import { attribute } from "grimoirejs/ref/Core/Decorator";
import GLConstantUtility from "../../Util/GLConstantUtility";

export default class TextureBufferUpdatorBase<T extends Texture> extends TextureUpdatorComponentBase<T> {
    public static componentName = "TextureBufferUpdatorBase";

    @attribute(EnumConverter, WebGLRenderingContext.UNSIGNED_BYTE, "type", { table: GLConstantUtility.textureElementTypeFromName })
    public type!: number;

    @attribute(EnumConverter, WebGLRenderingContext.RGBA, "format", { table: GLConstantUtility.textureFormatFromName })
    public format!: number;

}
