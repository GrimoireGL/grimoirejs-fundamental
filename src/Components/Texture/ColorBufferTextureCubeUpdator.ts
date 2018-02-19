import { IAttributeDeclaration } from "grimoirejs/ref/Interface/IAttributeDeclaration";
import RenderingBufferResourceRegistry from "../../Resource/RenderingTarget/RenderingBufferResourceRegistry";
import TextureCube from "../../Resource/TextureCube";
import TextureUpdatorComponentBase from "./TextureUpdatorComponentBase";
import { StringConverter } from "grimoirejs/ref/Converter/StringConverter";
import Identity from "grimoirejs/ref/Core/Identity";
import EnumConverter from "grimoirejs/ref/Converter/EnumConverter";
import { StandardAttribute } from "grimoirejs/ref/Core/Attribute";
import TextureBufferUpdatorBase from "./TextureBufferUpdatorBase";

export default class ColorBufferTextureCubeUpdator extends TextureBufferUpdatorBase<TextureCube> {
    public static componentName = "ColorBufferTextureCubeUpdator";
    public static attributes = {
        name: {
            converter: StringConverter,
            default: null,
        }
    };

    protected $awake(): void {
        super.$awake();
        const name = this.getAttribute(ColorBufferTextureCubeUpdator.attributes.name);
        if (name) {
            RenderingBufferResourceRegistry.get(this.companion.get("gl")!).setBackbuffer(this.getAttribute(ColorBufferTextureCubeUpdator.attributes.name), this.__texture);
        }
        this.__texture.updateDirectly(1, 1, {} as any, this.format, this.type, 0);
    }

    public resize(width: number, height: number): void {
        this.__texture.updateDirectly(width, height, {} as any, this.format, this.type, 0);
    }
}
