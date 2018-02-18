import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import Texture from "../../Resource/Texture";
import Texture2D from "../../Resource/Texture2D";
import ResizableResourceUpdator from "./ResizableResourceUpdator";
import TextureContainer from "./TextureContainer";
import TextureContainerBase from "./TextureContainerBase";
import { BooleanConverter } from "grimoirejs/ref/Converter/BooleanConverter";
import Identity from "grimoirejs/ref/Core/Identity";

export default class TextureUpdatorComponentBase<T extends Texture> extends ResizableResourceUpdator {
    public static componentName = "TextureUpdatorComponentBase";
    public static attributes = {
        ...ResizableResourceUpdator.attributes,
        flipY: {
            converter: BooleanConverter,
            default: true,
        },
        premultipliedAlpha: {
            converter: BooleanConverter,
            default: false,
        },
    };

    private textureComponent!: TextureContainerBase<T>;
    protected get __texture(): T {
        return this.textureComponent.texture;
    }

    protected $awake(): void {
        super.$awake();
        const tc = this.node.getComponent<TextureContainerBase<T>>(TextureContainerBase);
        if (!tc) {
            throw new Error(`Texture updater should have TextureContainerBase in same ndoe`);
        }
        this.textureComponent = tc;
    }
}
