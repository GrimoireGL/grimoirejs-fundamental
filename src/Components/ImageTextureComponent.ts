import Component from "grimoirejs/ref/Node/Component";
import IAttributeDeclaration from "grimoirejs/ref/Node/IAttributeDeclaration";
import TextureComponent from "./TextureComponent";
import ImageResolver from "../Asset/ImageResolver";
export default class ImageTextureComponent extends Component {
    public static attributes: { [key: string]: IAttributeDeclaration } = {
        src: {
            converter: "String",
            default: null
        },
        flipY: {
            converter: "Boolean",
            default: false
        },
        premultipliedAlpha: {
            converter: "Boolean",
            default: false
        }
    };

    public flipY: boolean;

    public premultipliedAlpha: boolean;

    public src: string;

    private _textureComponent: TextureComponent;

    public $mount() {
        this.__bindAttributes();
        this._textureComponent = this.node.getComponent(TextureComponent);
        this.getAttributeRaw("src").watch((v: string) => {
            if (v !== null) {
                this._loadTask(v);
            }
        }, true);
    }

    private async _loadTask(src: string): Promise<void> {
        const image = await ImageResolver.resolve(src);
        this._textureComponent.texture.update(image, {
            premultipliedAlpha: this.premultipliedAlpha,
            flipY: this.flipY
        });
    }
}
