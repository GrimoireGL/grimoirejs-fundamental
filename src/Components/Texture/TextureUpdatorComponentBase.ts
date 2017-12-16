import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import Texture from "../../Resource/Texture";
import Texture2D from "../../Resource/Texture2D";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import TextureContainer from "./TextureContainer";
import TextureContainerBase from "./TextureContainerBase";

export default class TextureUpdatorComponentBase<T extends Texture> extends ResizableResourceUpdator {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        flipY: {
            converter: "Boolean",
            default: true,
        },
        premultipliedAlpha: {
            converter: "Boolean",
            default: false,
        },
    };

    private textureComponent: TextureContainerBase<T>;
    protected get __texture(): T {
        return this.textureComponent.texture;
    }

    protected $awake(): void {
        super.$awake();
        this.textureComponent = this.node.getComponent(TextureContainerBase);
    }
}
