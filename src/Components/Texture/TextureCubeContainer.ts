import Component from "grimoirejs/ref/Core/Component";
import IAttributeDeclaration from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Texture2D from "../../Resource/Texture2D";
import TextureCube from "../../Resource/TextureCube";
import TextureContainerBase from "./TextureContainerBase";
export default class TextureCubeContainer extends TextureContainerBase<TextureCube> {
    public static componentName = "TextureCubeContainer";
    protected __createTexture(gl: WebGLRenderingContext): TextureCube {
        return new TextureCube(gl);
    }
}
