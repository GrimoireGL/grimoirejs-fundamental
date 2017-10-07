import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Texture2D from "../../Resource/Texture2D";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import TextureContainer from "./TextureContainer";

export default class TextureUpdatorComponentBase extends ResizableResourceUpdator {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        flipY: {
            converter: "Boolean",
            default: false,
        },
        premultipliedAlpha: {
            converter: "Boolean",
            default: false,
        },
    };

    private textureComponent: TextureContainer;
    protected get __texture (): Texture2D {
        return this.textureComponent.texture;
    }

    public $awake (): void {
        super.$awake();
        this.textureComponent = this.node.getComponent(TextureContainer);
    }
}
