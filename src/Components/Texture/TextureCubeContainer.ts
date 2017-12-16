import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Texture2D from "../../Resource/Texture2D";
import TextureCube from "../../Resource/TextureCube";
import TextureContainerBase from "./TextureContainerBase";
export default class TextureCubeContainer extends TextureContainerBase<TextureCube> {
    protected __createTexture(gl: WebGLRenderingContext): TextureCube {
        return new TextureCube(gl);
    }
}