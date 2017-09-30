import BasicComponent from "../BasicComponent";
import Texture2D from "../../Resource/Texture2D";
import TextureContainer from "./TextureContainer";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";

export default class TextureUpdatorComponentBase extends BasicComponent {
    public static attributes:{ [key: string]: IAttributeDeclaration } = {
        flipY: {
            converter: "Boolean",
            default: false
        },
        premultipliedAlpha: {
            converter: "Boolean",
            default: false
        }
    };

    private textureComponent: TextureContainer;
    protected get __texture(): Texture2D {
        return this.textureComponent.texture;
    }

    public $mount(): void {
        this.textureComponent = this.node.getComponent(TextureContainer);
    }
}
