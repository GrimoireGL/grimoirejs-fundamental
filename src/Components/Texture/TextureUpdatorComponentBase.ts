import BasicComponent from "../BasicComponent";
import Texture2D from "../../Resource/Texture2D";
import TextureContainer from "./TextureContainer";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import ResizableResourceUpdator from "./ResizableResourceUpdator";

export default class TextureUpdatorComponentBase extends ResizableResourceUpdator {
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
        super.$mount();
        this.textureComponent = this.node.getComponent(TextureContainer);
    }
}
